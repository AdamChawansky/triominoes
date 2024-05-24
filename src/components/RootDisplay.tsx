import { useEffect, useState } from 'react';
import { eraseGameHistory, initializeNewGameHistory, simulateCompleteGame, simulateOneAction } from '../game/generator.ts';
import { replayHistory } from '../game/history.ts';
import { Action, FirebaseGameData, GameHistory, GameState, NewTile } from '../game/types.ts';
import { firebaseSaveGameData, firebaseSubscribeGameData } from '../online/firebaseApi.ts';
import { DisplayHand } from './DisplayHand.tsx';
import { DisplayGameLog } from './DisplayLog.tsx';
import { DisplayScores } from './DisplayScores.tsx';
import './RootDisplay.css';
import { GameBoardView } from './DisplayGameBoard.tsx';
import ChatComponent from './ChatComponent.tsx';
import { CopyToClipboard } from '../online/CopyToClipboard.tsx';
import { MAX_DRAW } from '../game/logic.ts';

export function RootDisplay(props: {
  initialGameData: FirebaseGameData,
  localPlayerID: string,
}) {
  // local state
  const [gameData, setGameData] = useState<FirebaseGameData>(props.initialGameData);
  const [tileInHand, setTileInHand] = useState<NewTile | undefined>();
  const [gameInProgress, setGameInProgress] = useState(false);
  
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

  const playerIndex = gameData.players.findIndex((player) => player.playerID === props.localPlayerID);
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
    setGameInProgress(true);
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

  // Automatically makes first available action: play / draw / pass
  function takeStep() {
    const updatedGameHistory = simulateOneAction(gameData.gameHistory);
    setGameHistory(updatedGameHistory);
    if( updatedGameHistory.actions[updatedGameHistory.actions.length - 1].actionType === 'end' ) {
      setGameInProgress(false);
    }
  }

  function simulate() {
    const updatedGameHistory = simulateCompleteGame(gameData.gameHistory);
    setGameHistory(updatedGameHistory);
    setGameInProgress(false);
  }

  function pushAction(action: Action) {
    const updatedGameHistory = {
      startingDeck: gameData.gameHistory.startingDeck,
      actions: gameData.gameHistory.actions.concat(action),
    };
    setGameHistory(updatedGameHistory);
  }

  // Automate computer plays
  useEffect(() => {
    if( gameInProgress ) {
      const activePlayerName = gameState.playerNames[gameState.activePlayer];
      if( activePlayerName.startsWith("Computer")) {
        const timer = setTimeout(() => {
          takeStep();
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [gameInProgress, gameHistory.actions]);

  // Determine the button label and onClick handler based on the game state
  function getButtonLabel(gameState: GameState) {
    if( gameState.gameBoard.size === 0) {
      return "START GAME";
    } else if( gameHistory.actions[gameHistory.actions.length - 1].actionType === 'end' ) {
      return "NEW GAME";
    } else {
      return gameState.tilesDrawnThisTurn < MAX_DRAW && gameState.drawPile.length > 0 ? "DRAW" : "PASS";
    }
  }

  function getButtonClick(gameState: GameState) {
    if( gameState.gameBoard.size === 0 || gameHistory.actions[gameHistory.actions.length - 1].actionType === 'end' ) {
      return startNewGame;
    } else {
      return takeStep;
    }
  }

  return (
    <main>
        <div className="left-container">
        <CopyToClipboard toCopy={gameData.gameID}/>
          <div className="buttons-container">
            <button className="button" onClick={getButtonClick(gameState)}>{getButtonLabel(gameState)}</button>
          </div>
          <GameBoardView 
            gameState={gameState}
            tileInHand={tileInHand}
            setTileInHand={setTileInHand}
            pushAction={pushAction}
          />
          <div className="bottom-container">
            <DisplayHand 
                playerIndex={playerIndex}
                gameState={gameState} 
                tileInHand={tileInHand}
                setTileInHand={setTileInHand}
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
          playerIndex={playerIndex}/>
      </div>
    </main>
  );
}