import { useEffect, useState } from 'react';
import { eraseGameHistory, simulateCompleteGame, simulateOneAction } from '../game/generator.ts';
import { replayHistory } from '../game/history.ts';
import { Action, GameHistory, NewTile } from '../game/types.ts';
import { getGameHistory, saveGameHistory } from '../online/firebaseApi.ts';
import { DisplayHand } from './DisplayHand.tsx';
import { DisplayGameLog } from './DisplayLog.tsx';
import { DisplayScores } from './DisplayScores.tsx';
import './Game.css';
import { GameBoardView } from './GameBoardView.tsx';

(window as any).fbapi = {
  getGameHistory,
  saveGameHistory,
};

export function RootDisplay(props: {
  gameID: string,
  numPlayers: number,
  playerName: string,
}) {
  const [gameHistory, setGameHistory] = useState<GameHistory>({
    startingDeck: [],
    actions: [
      { actionType: 'add-player', playerName: props.playerName },
    ],
  });
  const [tileInHand, setTileInHand] = useState<NewTile | undefined>();

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        const gameID = props.gameID;
        const gameHistory = await getGameHistory(gameID);
        if (gameHistory) {
          setGameHistory(gameHistory);
        }
      } catch (error) {
        console.error('Error fetching game history:', error);
      }
    };
  
    fetchGameHistory();
  }, [props.gameID]);

  useEffect(() => {
    // when gameHistory changes, reset hand selection
    setTileInHand(undefined);
  }, [gameHistory]);
  
  if (gameHistory === null) {
    return <div>Loading game history...</div>;
  }

  const gameState = replayHistory(gameHistory);
  const setGame = () => {};

  function startNewGame() {
    const newGameHistory: GameHistory = {
      startingDeck: [],
      actions: [
        { actionType: 'add-player', playerName: props.playerName },
      ],
    };
    setGameHistory(newGameHistory);
    saveGameHistory(props.gameID, newGameHistory);
  }

  function resetGame() {
    setGameHistory(eraseGameHistory(gameHistory));
  }

  function performUndo() {
    setGameHistory({
      startingDeck: gameHistory.startingDeck,
      actions: gameHistory.actions[gameHistory.actions.length - 1].actionType === 'init'
      ? gameHistory.actions
      : gameHistory.actions.slice(0, -1),
    });
  }

  function takeStep() {
    setGameHistory(simulateOneAction(gameHistory));
  }

  function simulate() {
    setGameHistory(simulateCompleteGame(gameHistory));
  }

  function pushAction(action: Action) {
    setGameHistory({
      startingDeck: gameHistory.startingDeck,
      actions: gameHistory.actions.concat(action),
    });
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