import { GameState } from '../game/types.ts';
import { BlockInHand } from './BlockInHand.tsx';
import './Game.css';

export function DisplayHand(props: {
  playerIndex: number,
  gameState: GameState,
}) {
  const playerHand = props.gameState.hands[props.playerIndex];
  return (
    <div className="player-hand">
      {playerHand.map((newBlock, index) => (
        <BlockInHand
          key = {newBlock.id}
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
