import { useState } from 'react';
import { makeNewBlocks, createGameHistory } from '../game/generator.ts';
import { simulateHistory } from '../game/history.ts';
import { GameHistory } from '../game/types.ts';
import { DisplayHand } from './DisplayHand.tsx';
import './Game.css';
import { GameBoardView } from './GameBoardView.tsx';

export function RootDisplay() {
  const [gameHistory, setGameHistory] = useState<GameHistory>(createGameHistory(1));
  const gameState = simulateHistory(gameHistory);
  const setGame = () => {};

  function startNewGame() {
    setGameHistory(createGameHistory(1));
  }

  function performUndo() {
    setGameHistory({
      startingDeck: gameHistory.startingDeck,
      actions: gameHistory.actions.slice(0, -1),
    });
  }

  return (
    <main>
      <GameBoardView 
        gameState={gameState} 
        setGame={setGame}
      />
      <DisplayHand 
        playerIndex={0}
        gameState={gameState} 
      />
      <button
        onClick={startNewGame}
      >
        NEW GAME
      </button>
      <button 
        onClick={performUndo}
      >
        UNDO
      </button>
      {/* todo game log, score, etc */}
    </main>
  );
}

// Add style for triangles
// Render the hand (can hard code and refactor later)
// Add a running score tracker
