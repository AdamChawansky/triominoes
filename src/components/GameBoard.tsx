import { BlockOnBoard } from './BlockOnBoard';
import './Game.css';
import { simulateGame } from '../game/main.ts';
import { toCoord } from '../game/util.ts'

export function GameBoard() {
  const game = simulateGame();
  return (
    <main>
      {Array.from(game.entries()).map(([coord, placedBlock]) => (
        <BlockOnBoard
          key = {coord}
          coord = {toCoord(coord)}
          placedBlock = {placedBlock}
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
