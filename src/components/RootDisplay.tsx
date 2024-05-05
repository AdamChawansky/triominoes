import { useState } from 'react';
import { initializeNewGameHistory, simulateCompleteGame, simulateOneAction, eraseGameHistory } from '../game/generator.ts';
import { replayHistory } from '../game/history.ts';
import { Action, GameHistory, NewBlock } from '../game/types.ts';
import { DisplayHand } from './DisplayHand.tsx';
import './Game.css';
import { GameBoardView } from './GameBoardView.tsx';
import { DisplayScores } from './DisplayScores.tsx';
import { DisplayGameLog } from './DisplayLog.tsx';

export function RootDisplay() {
  const [gameHistory, setGameHistory] = useState<GameHistory>(initializeNewGameHistory(1));
  const [tileInHand, setTileInHand] = useState<NewBlock | undefined>();
  const gameState = replayHistory(gameHistory);
  const setGame = () => {};

  function startNewGame() {
    setGameHistory(initializeNewGameHistory(1));
    setTileInHand(undefined);
  }

  function resetGame() {
    setGameHistory(eraseGameHistory(gameHistory));
    setTileInHand(undefined);
  }

  function performUndo() {
    setGameHistory({
      startingDeck: gameHistory.startingDeck,
      actions: gameHistory.actions.slice(0, -1),
    });
    setTileInHand(undefined);
  }

  function takeStep() {
    setGameHistory(simulateOneAction(gameHistory));
    setTileInHand(undefined);
  }

  function simulate() {
    setGameHistory(simulateCompleteGame(gameHistory));
    setTileInHand(undefined);
  }

  function pushAction(action: Action) {
    setGameHistory({
      startingDeck: gameHistory.startingDeck,
      actions: gameHistory.actions.concat(action),
    });
    setTileInHand(undefined);
  }

  return (
    <main>
      <GameBoardView 
        gameState={gameState} 
        setGame={setGame}
        tileInHand={tileInHand}
      />
      <DisplayHand 
        playerIndex={0}
        gameState={gameState} 
        pushAction={pushAction}
        tileInHand={tileInHand}
        setTileInHand={setTileInHand}
      />
      <DisplayScores
        gameState={gameState}
      />
      <DisplayGameLog
        gameState={gameState}
      />
      <button
        onClick={startNewGame}
      >
        NEW GAME
      </button>
      <button
        onClick={resetGame}
      >
        RESET GAME
      </button>
      <button 
        onClick={performUndo}
      >
        UNDO
      </button>
      <button
        onClick={takeStep}
      >
        STEP
      </button>
      <button
        onClick={simulate}
      >
        SIMULATE!  
      </button>
      {/* todo game log, score, etc */}
    </main>
  );
}