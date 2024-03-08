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
  
  // return (
  //   <main>
  //     <BlockOnBoard 
  //       coord={{ x: 0, y: 0 }}
  //       placedBlock={{
  //         newBlockID: '5,5,5',
  //         orientation: 'up',
  //         topCenter: 5,
  //         bottomLeft: 5,
  //         bottomRight: 5,
  //       }}
  //     />
  //     <BlockOnBoard 
  //       coord={{ x: 1, y: 0 }}
  //       placedBlock={{
  //         newBlockID: '4,5,5',
  //         orientation: 'down',
  //         bottomCenter: 5,
  //         topLeft: 5,
  //         topRight: 4,
  //       }}
  //     />
  //     <BlockOnBoard 
  //       coord={{ x: 0, y: -1 }}
  //       placedBlock={{
  //         newBlockID: '0,5,5',
  //         orientation: 'down',
  //         bottomCenter: 0,
  //         topLeft: 5,
  //         topRight: 5,
  //       }}
  //     />
  // </main>
  );
}

// Add style for triangles
// Render the hand (can hard code and refactor later)
// Add a running score tracker
