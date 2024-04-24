import { useState } from 'react';
import { makeNewBlocks, createGameHistory, simulateGameHistory } from '../game/generator.ts';
import { replayHistory } from '../game/history.ts';
import { GameHistory } from '../game/types.ts';
import { DisplayHand } from './DisplayHand.tsx';
import './Game.css';
import { GameBoardView } from './GameBoardView.tsx';

export function RootDisplay() {
  const [gameHistory, setGameHistory] = useState<GameHistory>(createGameHistory(1));
  const gameState = replayHistory(gameHistory);
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

  function simulate() {
    setGameHistory(simulateGameHistory(gameHistory));
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
      <button
        onClick={simulate}
      >
        SIMULATE!  
      </button>
      {/* todo game log, score, etc */}
    </main>
  );
}

// Add style for triangles
// Render the hand (can hard code and refactor later)
// Add a running score tracker
