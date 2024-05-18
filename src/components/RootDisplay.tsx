import { useEffect, useState } from 'react';
import { eraseGameHistory, initializeNewGameHistory, simulateCompleteGame, simulateOneAction } from '../game/generator.ts';
import { replayHistory } from '../game/history.ts';
import { Action, FirebaseGameData, GameHistory, NewTile } from '../game/types.ts';
import { firebaseGetGameData, firebaseSaveGameData, firebaseSubscribeGameData } from '../online/firebaseApi.ts';
import { DisplayHand } from './DisplayHand.tsx';
import { DisplayGameLog } from './DisplayLog.tsx';
import { DisplayScores } from './DisplayScores.tsx';
import './Game.css';
import { GameBoardView } from './GameBoardView.tsx';

// (window as any).fbapi = {
//   getGameData,
//   saveGameData,
// };

export function RootDisplay(props: {
  initialGameData: FirebaseGameData,
}) {
  // local state
  const [gameData, setGameData] = useState<FirebaseGameData>(props.initialGameData);
  const [tileInHand, setTileInHand] = useState<NewTile | undefined>();

  // on first render
  useEffect(() => {
    async function doTheThing() {
      await firebaseSubscribeGameData(
        props.initialGameData,
        gameData => setGameData(gameData),
      );
    }
    doTheThing();
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
    const newGameHistory = {
      startingDeck: gameData.gameHistory.startingDeck,
      actions: gameData.gameHistory.actions[gameData.gameHistory.actions.length - 1].actionType === 'init'
      ? gameData.gameHistory.actions
      : gameData.gameHistory.actions.slice(0, -1),
    };
    setGameHistory(newGameHistory);
  }

  function takeStep() {
    const newGameHistory = simulateOneAction(gameData.gameHistory);
    setGameHistory(newGameHistory);
  }

  function simulate() {
    const newGameHistory = simulateCompleteGame(gameData.gameHistory);
    setGameHistory(newGameHistory);
  }

  function pushAction(action: Action) {
    const newGameHistory = {
      startingDeck: gameData.gameHistory.startingDeck,
      actions: gameData.gameHistory.actions.concat(action),
    };
    setGameHistory(newGameHistory);
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