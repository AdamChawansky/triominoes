import { BlockOnBoard } from './BlockOnBoard';
import './Game.css';
import { simulateGame } from '../game/main.ts';
import { toCoord } from '../game/util.ts'
import { useState } from 'react';

export function GameBoard() {
  const [game, setGame] = useState(simulateGame());
  return (
    <main>
      {Array.from(game.entries()).map(([coord, placedBlock]) => (
        <BlockOnBoard
          key = {coord}
          coord = {toCoord(coord)}
          placedBlock = {placedBlock}
          game={game}
          setGame={setGame}
        />
      ))}
    </main>
  );
}

export function DisplayHand() {

}


// Add style for triangles
// Render the hand (can hard code and refactor later)
// Add a running score tracker
