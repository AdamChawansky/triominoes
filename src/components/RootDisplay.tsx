import { useEffect, useState } from 'react';
import { eraseGameHistory, initializeNewGameHistory, simulateCompleteGame, simulateOneAction } from '../game/generator.ts';
import { replayHistory } from '../game/history.ts';
import { Action, FirebaseGameData, GameHistory, NewTile } from '../game/types.ts';
import { getGameData, saveGameData } from '../online/firebaseApi.ts';
import { DisplayHand } from './DisplayHand.tsx';
import { DisplayGameLog } from './DisplayLog.tsx';
import { DisplayScores } from './DisplayScores.tsx';
import './Game.css';
import { GameBoardView } from './GameBoardView.tsx';

(window as any).fbapi = {
  getGameData,
  saveGameData,
};

export function RootDisplay(props: {
  importedGameData: FirebaseGameData,
}) {
  const [gameData, setGameData] = useState<FirebaseGameData>(props.importedGameData);
  const [gameHistory, setGameHistory] = useState<GameHistory>(initializeNewGameHistory(gameData.numPlayers));
  const [tileInHand, setTileInHand] = useState<NewTile | undefined>();

  const gameState = replayHistory(gameHistory);
  const setGame = () => {};

  useEffect(() => {
    setGameHistory(gameData.gameHistory);
  }, [gameData.gameHistory]);

  // useEffect(() => {
  //   const fetchGameData = async () => {
  //     try {
  //       const gameID = props.importedGameData.gameID;
  //       const gameData = await getGameData(gameID);
  //       if (gameData) {
  //         setGameHistory(gameData.gameHistory);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching game history:', error);
  //     }
  //   };
  
  //   fetchGameData();
  // }, [props.importedGameData.gameID]);

  // when gameHistory changes, reset hand selection --> but maybe don't want that behavior from other people playing
  // useEffect(() => {
  //   setTileInHand(undefined);
  // }, [gameHistory]);
  
  function startNewGame() {
    const newGameHistory = initializeNewGameHistory(gameData.numPlayers);

    const updatedGameData: FirebaseGameData = {
      ...gameData,
      gameHistory: newGameHistory,
    };
    setGameData(updatedGameData);
    saveGameData(updatedGameData);
  }

  function resetGame() {
    const resetGameHistory = eraseGameHistory(gameData.gameHistory);
    const updatedGameData: FirebaseGameData = {
      ...gameData,
      gameHistory: resetGameHistory,
    };
    setGameData(updatedGameData);
    saveGameData(updatedGameData);
  }

  function performUndo() {
    const newGameHistory = {
      startingDeck: gameData.gameHistory.startingDeck,
      actions: gameData.gameHistory.actions[gameData.gameHistory.actions.length - 1].actionType === 'init'
      ? gameData.gameHistory.actions
      : gameData.gameHistory.actions.slice(0, -1),
    };

    const updatedGameData: FirebaseGameData = {
      ...gameData,
      gameHistory: newGameHistory,
    };
    setGameData(updatedGameData);
    saveGameData(updatedGameData);
  }

  function takeStep() {
    const newGameHistory = simulateOneAction(gameData.gameHistory);

    const updatedGameData: FirebaseGameData = {
      ...gameData,
      gameHistory: newGameHistory,
    };
    setGameData(updatedGameData);
    saveGameData(updatedGameData);
  }

  function simulate() {
    const newGameHistory = simulateCompleteGame(gameData.gameHistory);

    const updatedGameData: FirebaseGameData = {
      ...gameData,
      gameHistory: newGameHistory,
    };
    setGameData(updatedGameData);
    saveGameData(updatedGameData);
  }

  function pushAction(action: Action) {
    const newGameHistory = {
      startingDeck: gameData.gameHistory.startingDeck,
      actions: gameData.gameHistory.actions.concat(action),
    };

    const updatedGameData: FirebaseGameData = {
      ...gameData,
      gameHistory: newGameHistory,
    };
    setGameData(updatedGameData);
    saveGameData(updatedGameData);
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
              setGame={setGame}
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