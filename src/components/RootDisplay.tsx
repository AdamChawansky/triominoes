import { useState } from 'react';
import { initializeNewGameHistory, simulateCompleteGame, simulateOneAction, eraseGameHistory } from '../game/generator.ts';
import { replayHistory } from '../game/history.ts';
import { GameHistory } from '../game/types.ts';
import { DisplayHand } from './DisplayHand.tsx';
import './Game.css';
import { GameBoardView } from './GameBoardView.tsx';
import { DisplayScores } from './DisplayScores.tsx';

export function RootDisplay() {
  const [gameHistory, setGameHistory] = useState<GameHistory>(initializeNewGameHistory(1));
  const gameState = replayHistory(gameHistory);
  const setGame = () => {};

  function startNewGame() {
    setGameHistory(initializeNewGameHistory(1));
  }

  function resetGame() {
    setGameHistory(eraseGameHistory(gameHistory));
  }

  function performUndo() {
    setGameHistory({
      startingDeck: gameHistory.startingDeck,
      actions: gameHistory.actions.slice(0, -1),
    });
  }

  function takeStep() {
    setGameHistory(simulateOneAction(gameHistory));
  }

  function simulate() {
    setGameHistory(simulateCompleteGame(gameHistory));
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
      <DisplayScores
        gameState={gameState}
      />
      <DisplayGameLo
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

// Add style for triangles
// Render the hand (can hard code and refactor later)
// Add a running score tracker
