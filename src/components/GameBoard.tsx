import { BlockOnBoard } from './BlockOnBoard';
import './Game.css';
import { simulateGame } from '../game/main.ts';
import { toCoord } from '../game/util.ts'
import { useState } from 'react';
import { GameState } from '../game/types.ts';
import { BlockInHand } from './BlockInHand.tsx';

export function GameBoard() {
  const [gameState, setGame] = useState(simulateGame());

  return (
    <main>
      <div className="game-board">
        {Array.from(gameState.gameBoard.entries()).map(([coord, placedBlock]) => (
          <BlockOnBoard
            key = {coord}
            coord = {toCoord(coord)}
            placedBlock = {placedBlock}
            game={gameState}
            setGame={setGame}
          />
        ))}
      </div>
      <DisplayHand 
        playerIndex={0}
        gameState={gameState} 
      />
    </main>
  );
}

export function DisplayHand(props: {
  playerIndex: number,
  gameState: GameState,
}) {
  const playerHand = props.gameState.hands[props.playerIndex];
  return (
    <div className="player-hand">
      {playerHand.map((newBlock, index) => (
        <BlockInHand
          index = {index}
          newBlock = {newBlock}
        />
      ))}
    </div>
  );
}


// Add style for triangles
// Render the hand (can hard code and refactor later)
// Add a running score tracker
