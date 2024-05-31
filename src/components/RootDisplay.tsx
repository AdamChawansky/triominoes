import { useEffect, useRef, useState } from 'react';
import { initializeNewGameHistory, simulateOneAction } from '../game/generator.ts';
import { replayHistory } from '../game/history.ts';
import { MAX_DRAW, pointsFromPlay } from '../game/logic.ts';
import { Action, FirebaseGameData, GameHistory, GameState, NewTile } from '../game/types.ts';
import { CopyToClipboard } from '../online/CopyToClipboard.tsx';
import { firebaseSaveGameData, firebaseSubscribeGameData } from '../online/firebaseApi.ts';
import ChatComponent from './ChatComponent.tsx';
import { GameBoardView } from './DisplayGameBoard.tsx';
import { DisplayHand } from './DisplayHand.tsx';
import { DisplayGameLog } from './DisplayLog.tsx';
import { DisplayScores } from './DisplayScores.tsx';
import './RootDisplay.css';
import activePlayerSound from '../../public/456965-notification.mp3'
import victorySound from '../../public/456968-win-game.mp3'
import failureSound from '../../public/639945-lose-game.wav'
import bridgeOrHexagonSound from '../../public/442586-bridge.wav'
import { clearTilesFromLocalStorage } from '../localStorageUtils.ts';

export function RootDisplay(props: {
  initialGameData: FirebaseGameData,
  localPlayerID: string,
}) {
  // local state
  const [gameData, setGameData] = useState<FirebaseGameData>(props.initialGameData);
  const [tileInHand, setTileInHand] = useState<NewTile | undefined>();
  
  // on first render
  useEffect(() => {
    async function startSubscription() {
      await firebaseSubscribeGameData(
        props.initialGameData,
        firebaseGameData => setGameData(firebaseGameData),
      );
    }
    startSubscription();
  }, []);

  const playerIndex = gameData.players.findIndex((player) => player.localPlayerID === props.localPlayerID);
  const playerName = playerIndex !== -1 ? gameData.players[playerIndex].playerName : '';
  // console.log(gameData.players);

  // helpers
  const gameHistory = gameData.gameHistory;
  function setGameHistory(newGameHistory: GameHistory, gameInProgress: boolean ) {
    firebaseSaveGameData({
      ...gameData,
      gameHistory: newGameHistory,
      gameInProgress: gameInProgress,
    });
  }
  const gameState = replayHistory(gameHistory);

  function startNewGame() {
    const playerNames = gameData.players.map(player => player.playerName);
    const newGameHistory = initializeNewGameHistory(gameData.numPlayers, playerNames);
    setGameHistory(newGameHistory, true);
    clearTilesFromLocalStorage();
  }

  // Automatically makes first available action: play / draw / pass
  function takeStep() {
    const updatedGameHistory = simulateOneAction(gameData.gameHistory);
    const updatedGameInProgress = updatedGameHistory.actions[updatedGameHistory.actions.length - 1].actionType !== 'end';
    setGameHistory(updatedGameHistory, updatedGameInProgress);
  }

  function pushAction(action: Action) {
    const updatedGameHistory = {
      startingDeck: gameData.gameHistory.startingDeck,
      actions: gameData.gameHistory.actions.concat(action),
    };

    const updatedGameInProgress = action.actionType !== 'end';
    setGameHistory(updatedGameHistory, updatedGameInProgress);
  }

  // Automate computer plays
  useEffect(() => {
    if( gameData.gameInProgress ) {
      const activePlayerName = gameState.playerNames[gameState.activePlayer];
      if( activePlayerName.startsWith("Computer")) {
        const timer = setTimeout(() => {
          takeStep();
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [gameData.gameInProgress, gameHistory.actions]);

  // Determine the button label and onClick handler based on the game state
  function getButtonLabel(gameState: GameState) {
    if( gameState.gameBoard.size === 0 ) {
      return "START GAME";
    } else if( !gameData.gameInProgress ) {
      return "NEW GAME";
    } else {
      const tilesRemaining = gameState.drawPile.length;
      return (
        <>
          { gameState.tilesDrawnThisTurn < MAX_DRAW && tilesRemaining > 0 ? "DRAW" : "PASS" }
          <br/>
          <span className='tiles-remaining'>{tilesRemaining} tiles left</span>
        </>
      );
    }
  }

  function getButtonClick() {
    if( !gameData.gameInProgress ) {
      return startNewGame;
    } else {
      return takeStep;
    }
  }

  // Enable or disable visual highlight of available plays
  const [moveHighlightingEnabled, setMoveHighlightingEnabled] = useState(true);

  function handleMoveHighlightingToggle() {
    setMoveHighlightingEnabled(prevState => !prevState);
  }

  // Sound effects code below
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(false);

  function handleSoundToggle() {
    setSoundEffectsEnabled(prevState => !prevState);
  }

  // Play a notification when it's your turn
  const activePlayerSoundRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if( soundEffectsEnabled && gameData.gameInProgress && gameState.activePlayer === playerIndex ) {
      activePlayerSoundRef.current?.play();
    }
  }, [gameData.gameInProgress, gameState.activePlayer, playerIndex]);

  // Play a sound if a player makes a hexagon or bridge
  const bridgeOrHexagonSoundRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const lastAction = gameHistory.actions[gameHistory.actions.length - 1];
    if( soundEffectsEnabled && lastAction && lastAction.actionType === 'play' ) {
      const points = pointsFromPlay(lastAction.tilePlayed, lastAction.coord, gameState.gameBoard);
      if( points >= 40 ) {
        bridgeOrHexagonSoundRef.current?.play();
      }
    }
  }, [gameHistory.actions, gameState.gameBoard]);

  // Play a victory / failure notification if you win / lose 
  const victorySoundRef = useRef<HTMLAudioElement | null>(null);
  const failureSoundRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if( soundEffectsEnabled && !gameData.gameInProgress && gameState.gameBoard.size > 0 ) {
      const playerScore = gameState.scores[playerIndex];
      const highestScore = Math.max(...gameState.scores);

      if( playerScore === highestScore ) {
        victorySoundRef.current?.play();
      } else {
          failureSoundRef.current?.play();
      }
    }
  }, [gameData.gameInProgress, gameState.scores, playerIndex]);


  return (
    <main>
      <audio ref={activePlayerSoundRef} src={activePlayerSound}/>
      <audio ref={bridgeOrHexagonSoundRef} src={bridgeOrHexagonSound}/>
      <audio ref={victorySoundRef} src={victorySound}/>
      <audio ref={failureSoundRef} src={failureSound}/>
      <div className="left-container">
        <div className="buttons-container">
          <CopyToClipboard toCopy={gameData.gameID}/>
          {gameData.players[playerIndex].playerType !== 'spectator' && (
          <button className="button"
            onClick={getButtonClick()}
            disabled={gameData.gameInProgress && gameState.activePlayer !== playerIndex}
          >
            {getButtonLabel(gameState)}
          </button>
          )}
          <div className="right-aligned-buttons">
            <button className="sound-toggle-button" onClick={handleSoundToggle}>
              {soundEffectsEnabled ? '🔊' : '🔇'}
            </button>
            <button
              className="move-highlighting-toggle-button"
              onClick={handleMoveHighlightingToggle}
              style={{
                textDecoration: moveHighlightingEnabled ? 'none' : 'line-through',
                color: moveHighlightingEnabled ? 'green' : 'red',
              }}
            >
              {moveHighlightingEnabled ? 'SHOW MOVES' : 'SHOW MOVES'}
            </button>
          </div>
        </div>
        <GameBoardView 
          gameState={gameState}
          tileInHand={tileInHand}
          setTileInHand={setTileInHand}
          pushAction={pushAction}
          isActivePlayer={gameState.activePlayer === playerIndex}
          moveHighlightingEnabled={moveHighlightingEnabled}
        />
        <div className="bottom-container">
          {gameData.players[playerIndex].playerType !== 'spectator' && (
          <DisplayHand 
              playerIndex={playerIndex}
              gameState={gameState} 
              tileInHand={tileInHand}
              setTileInHand={setTileInHand}
              soundEffectsEnabled={soundEffectsEnabled}
          />
          )}
        </div>
      </div>
      <div className="right-container">
        <DisplayScores
          gameState={gameState}
        />
        <DisplayGameLog
          gameState={gameState}
        />
        <ChatComponent
          playerName={playerName}
          playerIndex={playerIndex}
          gameData={gameData}
        />
      </div>
    </main>
  );
}