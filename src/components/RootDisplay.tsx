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
import activePlayerSound from './../../public/456965-notification.mp3'
import victorySound from './../../public/456968-win-game.mp3'
import failureSound from './../../public/639945-lose-game.wav'
import bridgeSound from './../../public/442586-bridge.wav'
import hexagonSound from './../../public/37233-hexagon.wav'
import { clearTilesFromLocalStorage } from '../localStorageUtils.ts';
import { HowToPlayButton, HowToPlayPopup } from './HowToPlay.tsx';

export function replaySound(audio: HTMLAudioElement | null) {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
  audio.play();
}

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
    const newGameHistory = initializeNewGameHistory(gameData);
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
    if (action.actionType !== 'end' || !gameHistory.actions.some(a => a.actionType === 'end')) {
      const updatedGameHistory = {
        startingDeck: gameData.gameHistory.startingDeck,
        actions: gameData.gameHistory.actions.concat(action),
      };

      const updatedGameInProgress = action.actionType !== 'end';
      setGameHistory(updatedGameHistory, updatedGameInProgress);
    }
  }

  // Automate computer plays every 500ms
  useEffect(() => {
    if (gameData.gameInProgress) {
      const activePlayerName = gameState.playerNames[gameState.activePlayer];
      if (activePlayerName.startsWith("Computer")) {
        const timer = setTimeout(() => {
          takeStep();
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [gameData.gameInProgress, gameHistory.actions]);

  // Check if gameIsOver after every play
  // useEffect(() => {
  //   const gameIsOver = isGameOver(gameState);
  //   if (gameIsOver) {
  //     const updatedGameHistory = {
  //       ...gameHistory,
  //       action: [...gameHistory.actions, {actionType: 'end'}],
  //     };
  //     setGameHistory(updatedGameHistory, false);
  //   }
  // }, [gameState]);

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
    if (!gameData.gameInProgress) {
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
  const [myTurnStarted, setMyTurnStarted] = useState<boolean>(false);
  if (soundEffectsEnabled) {
    const isMyTurn = gameData.gameInProgress && gameState.activePlayer === playerIndex;
    if (isMyTurn && !myTurnStarted) {
      replaySound(activePlayerSoundRef.current);
      setMyTurnStarted(true);
    } else if (!isMyTurn && myTurnStarted) {
      setMyTurnStarted(false);
    }
  }

  // Used to only play sound effects once per turn
  const [numberOfActions, setNumberOfActions] = useState<number>(0);

  // Play a sound if a player makes a hexagon or bridge
  const bridgeSoundRef = useRef<HTMLAudioElement | null>(null);
  const hexagonSoundRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const lastAction = gameHistory.actions[gameHistory.actions.length - 1];
    if (soundEffectsEnabled && lastAction && lastAction.actionType === 'play') {
      const points = pointsFromPlay(lastAction.tilePlayed, lastAction.coord, gameState.gameBoard);
      if (numberOfActions !== gameHistory.actions.length) {
        if (points[1]) {
          replaySound(bridgeSoundRef.current);
        } else if (points[2]) {
          replaySound(hexagonSoundRef.current);
        }
        setNumberOfActions(gameHistory.actions.length);
      }
    }
  }, [gameData.gameHistory.actions]);

  // Play a victory / failure notification if you win / lose 
  const victorySoundRef = useRef<HTMLAudioElement | null>(null);
  const failureSoundRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (soundEffectsEnabled && !gameData.gameInProgress && gameState.gameBoard.size > 0) {
      const playerScore = gameState.scores[playerIndex];
      const highestScore = Math.max(...gameState.scores);

      if (numberOfActions !== gameHistory.actions.length) {
        if (playerScore === highestScore) {
          victorySoundRef.current?.play();
        } else {
          failureSoundRef.current?.play();
        }
        setNumberOfActions(gameHistory.actions.length);
      }
    }
  }, [gameData.gameHistory.actions]);

  // Add a pop-up window with HOW TO PLAY rules
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  const handleHowToPlayClick = () => {
    setIsHowToPlayOpen(true);
  }

  const handleHowToPlayClose = () => {
    setIsHowToPlayOpen(false);
  }

  // Set <main> to height of visible area, mostly for mobile styling
  useEffect(() => {
    function updateHeight() {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <main>
      <audio ref={activePlayerSoundRef} src={activePlayerSound}/>
      <audio ref={bridgeSoundRef} src={bridgeSound}/>
      <audio ref={hexagonSoundRef} src={hexagonSound}/>
      <audio ref={victorySoundRef} src={victorySound}/>
      <audio ref={failureSoundRef} src={failureSound}/>
      <HowToPlayPopup isOpen={isHowToPlayOpen} onClose={handleHowToPlayClose}/>
      <div className="left-container">
        <div className="button-container">
          <div className="button-group left">
            <HowToPlayButton onClick={handleHowToPlayClick}/>
          </div>
          <div className="button-group center">
            {gameData.players[playerIndex].playerType !== 'spectator' && (
            <button className="button"
              onClick={getButtonClick()}
              disabled={gameData.gameInProgress && gameState.activePlayer !== playerIndex}
            >
              {getButtonLabel(gameState)}
            </button>
            )}
          </div>
          <div className="button-group right">
            <button className="sound-toggle-button" onClick={handleSoundToggle}>
              {soundEffectsEnabled ? '🔊' : '🔇'}
            </button>
            <button
              className="move-highlighting-toggle-button"
              onClick={handleMoveHighlightingToggle}
              style={{
                textDecoration: moveHighlightingEnabled ? 'none' : 'line-through',
                color: moveHighlightingEnabled ? 'whitesmoke' : 'red',
              }}
            >
              {moveHighlightingEnabled ? 'SHOW MOVES' : 'SHOW MOVES'}
            </button>
          </div>
        </div>
        <CopyToClipboard toCopy={gameData.gameID}/>
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