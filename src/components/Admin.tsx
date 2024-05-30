import { useEffect, useRef, useState } from 'react';
import { eraseGameHistory, initializeNewGameHistory, simulateCompleteGame, simulateOneAction } from '../game/generator.ts';
import { replayHistory } from '../game/history.ts';
import { Action, FirebaseGameData, GameHistory, NewTile } from '../game/types.ts';
import { firebaseSaveGameData, firebaseSubscribeGameData } from '../online/firebaseApi.ts';
import { DisplayHand } from './DisplayHand.tsx';
import { DisplayGameLog } from './DisplayLog.tsx';
import { DisplayScores } from './DisplayScores.tsx';
import './RootDisplay.css';
import { GameBoardView } from './DisplayGameBoard.tsx';
import ChatComponent from './ChatComponent.tsx';
import { CopyToClipboard } from '../online/CopyToClipboard.tsx';
import { pointsFromPlay } from '../game/logic.ts';
import activePlayerSound from '../../public/456965-notification.mp3'
import victorySound from '../../public/456968-win-game.mp3'
import failureSound from '../../public/639945-lose-game.wav'
import bridgeOrHexagonSound from '../../public/442586-bridge.wav'
import { clearTilesFromLocalStorage } from '../localStorageUtils.ts';

export function Admin(props: {
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
        gameData => setGameData(gameData),
      );
    }
    startSubscription();
  }, []);

  const playerIndex = gameData.players.findIndex((player) => player.localPlayerID === props.localPlayerID);
  const playerName = playerIndex !== -1 ? gameData.players[playerIndex].playerName : '';

  // helpers
  const gameHistory = gameData.gameHistory;
  function setGameHistory(newGameHistory: GameHistory) {
    firebaseSaveGameData({
      ...gameData,
      gameHistory: newGameHistory,
    });
  }
  const gameState = replayHistory(gameHistory);
  
  function startNewGame() {
    const playerNames = gameData.players.map(player => player.playerName);
    const newGameHistory = initializeNewGameHistory(gameData.numPlayers, playerNames);
    setGameHistory(newGameHistory);
    clearTilesFromLocalStorage();
  }

  function resetGame() {
    const resetGameHistory = eraseGameHistory(gameData.gameHistory);
    setGameHistory(resetGameHistory);
  }

  function performUndo() {
    const updatedGameHistory = {
      startingDeck: gameData.gameHistory.startingDeck,
      actions: gameData.gameHistory.actions[gameData.gameHistory.actions.length - 1].actionType === 'init'
      ? gameData.gameHistory.actions
      : gameData.gameHistory.actions.slice(0, -1),
    };
    setGameHistory(updatedGameHistory);
  }

  function takeStep() {
    const updatedGameHistory = simulateOneAction(gameData.gameHistory);
    setGameHistory(updatedGameHistory);
  }

  function simulate() {
    const updatedGameHistory = simulateCompleteGame(gameData.gameHistory);
    setGameHistory(updatedGameHistory);
  }

  function pushAction(action: Action) {
    const updatedGameHistory = {
      startingDeck: gameData.gameHistory.startingDeck,
      actions: gameData.gameHistory.actions.concat(action),
    };
    setGameHistory(updatedGameHistory);
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
        if( activePlayerSoundRef.current ) {
          activePlayerSoundRef.current.play();
        }
      }
    }, [soundEffectsEnabled, gameData.gameInProgress, gameState.activePlayer, playerIndex]);
  
    // Play a sound if a player makes a hexagon or bridge
    const bridgeOrHexagonSoundRef = useRef<HTMLAudioElement | null>(null);
    useEffect(() => {
      const lastAction = gameHistory.actions[gameHistory.actions.length - 1];
      if( soundEffectsEnabled && lastAction && lastAction.actionType === 'play' ) {
        const points = pointsFromPlay(lastAction.tilePlayed, lastAction.coord, gameState.gameBoard);
        if( points >= 40 && bridgeOrHexagonSoundRef.current ) {
          bridgeOrHexagonSoundRef.current.play();
        }
      }
    }, [soundEffectsEnabled, gameHistory.actions, gameState.gameBoard]);
  
    // Play a victory / failure notification if you win / lose 
    const victorySoundRef = useRef<HTMLAudioElement | null>(null);
    const failureSoundRef = useRef<HTMLAudioElement | null>(null);
    useEffect(() => {
      if( soundEffectsEnabled && !gameData.gameInProgress && gameState.gameBoard.size > 0 ) {
        const playerScore = gameState.scores[playerIndex];
        const highestScore = Math.max(...gameState.scores);
  
        if( playerScore === highestScore ) {
          if( victorySoundRef.current ) {
            victorySoundRef.current.play();
          }
        } else {
          if( failureSoundRef.current ) {
            failureSoundRef.current.play();
          }
        }
      }
    }, [soundEffectsEnabled, gameData.gameInProgress, gameState.scores, playerIndex]);

  return (
    <main>
      <audio ref={activePlayerSoundRef} src={activePlayerSound}/>
      <audio ref={bridgeOrHexagonSoundRef} src={bridgeOrHexagonSound}/>
      <audio ref={victorySoundRef} src={victorySound}/>
      <audio ref={failureSoundRef} src={failureSound}/>
        <div className="left-container">
        <CopyToClipboard toCopy={gameData.gameID}/>
          <div className="buttons-container">
            <button className="button" onClick={startNewGame}>RESTART GAME</button>
            <button className="button" onClick={resetGame}>RESET GAME</button>
            <button className="button" onClick={performUndo}>UNDO</button>
            <button className="button" onClick={takeStep}>STEP</button>
            <button className="button" onClick={simulate}>SIMULATE!</button>
            <button className="sound-toggle-button" onClick={handleSoundToggle}>
              {soundEffectsEnabled ? '🔊' : '🔇'}
            </button>
          </div>
          <GameBoardView 
            gameState={gameState}
            tileInHand={tileInHand}
            setTileInHand={setTileInHand}
            pushAction={pushAction}
            isActivePlayer={gameState.activePlayer === playerIndex}
          />
          <div className="bottom-container">
            <DisplayHand 
              playerIndex={gameState.activePlayer}
              gameState={gameState} 
              tileInHand={tileInHand}
              setTileInHand={setTileInHand}
              soundEffectsEnabled={soundEffectsEnabled}
            />
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