import { useEffect, useState } from 'react';
import { eraseGameHistory, initializeNewGameHistory, simulateCompleteGame, simulateOneAction } from '../game/generator.ts';
import { replayHistory } from '../game/history.ts';
import { Action, FirebaseGameData, GameHistory, NewTile } from '../game/types.ts';
import { firebaseSaveGameData, firebaseSubscribeGameData } from '../online/firebaseApi.ts';
import { DisplayHand } from './DisplayHand.tsx';
import { DisplayGameLog } from './DisplayLog.tsx';
import { DisplayScores } from './DisplayScores.tsx';
import './Game.css';
import { GameBoardView } from './GameBoardView.tsx';
import ChatComponent from './ChatComponent.tsx';

export function RootDisplay(props: {
  initialGameData: FirebaseGameData,
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
    const newGameHistory = initializeNewGameHistory(gameData.numPlayers);
    setGameHistory(newGameHistory);
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

  // FOR LATER: Add button that indicates to start game when all human players have joined.
  // Should it shuffle, deal, and init all at once? 
  if(gameState.gameBoard.size === -1) {
    <div>
      <button onClick={startNewGame}>THIS BUTTON SHOULD BE IN THE MIDDLE OF GAMEBOARD?</button>
    </div>
  }

  return (
    <main>
      <div className="top-container">
        <div className="left-container">
          <div className="buttons-container">
            <button onClick={startNewGame}>NEW GAME</button>
            <button onClick={resetGame}>RESET GAME</button>
            <button onClick={performUndo}>UNDO</button>
            <button onClick={takeStep}>STEP</button>
            <button onClick={simulate}>SIMULATE!</button>
          </div>
            <GameBoardView 
              gameState={gameState}
              tileInHand={tileInHand}
              setTileInHand={setTileInHand}
              pushAction={pushAction}
          />
        </div>
        <div className="right-container">
          <DisplayScores
            gameState={gameState}
          />
          <DisplayGameLog
            gameState={gameState}
          />
          <ChatComponent playerName={gameState.playerNames[gameState.activePlayer]}/>
        </div>
      </div>
      <div className="bottom-container">
        <DisplayHand 
            playerIndex={0}
            gameState={gameState} 
            tileInHand={tileInHand}
            setTileInHand={setTileInHand}
        />
      </div>
    </main>
  );
}