import { useState } from 'react';
import { makeNewBlocks } from '../game/generator.ts';
import { simulateHistory } from '../game/history.ts';
import { GameHistory } from '../game/types.ts';
import { DisplayHand } from './DisplayHand.tsx';
import './Game.css';
import { GameBoardView } from './GameBoardView.tsx';

export function RootDisplay() {
  // const [gameState, setGame] = useState(simulateGame());
  const [gameHistory] = useState<GameHistory>({
    startingDeck: makeNewBlocks(),
    actions: [
      { actionType: 'draw', playerIndex: 0 },
      { actionType: 'draw', playerIndex: 0 },
      { actionType: 'draw', playerIndex: 0 },
      { actionType: 'draw', playerIndex: 0 },
      { actionType: 'draw', playerIndex: 0 },
      { actionType: 'draw', playerIndex: 0 },
    ],
  });
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
