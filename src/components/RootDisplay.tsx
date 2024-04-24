import { useState } from 'react';
import { makeNewBlocks, createGameHistory } from '../game/generator.ts';
import { simulateHistory } from '../game/history.ts';
import { GameHistory } from '../game/types.ts';
import { DisplayHand } from './DisplayHand.tsx';
import './Game.css';
import { GameBoardView } from './GameBoardView.tsx';

export function RootDisplay() {
  const [gameHistory] = useState<GameHistory>(createGameHistory(1));
  const gameState = simulateHistory(gameHistory);
  const setGame = () => {};

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
      {/* todo game log, score, etc */}
    </main>
  );
}

// Add style for triangles
// Render the hand (can hard code and refactor later)
// Add a running score tracker
