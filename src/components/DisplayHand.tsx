import { ActionPusher, GameState } from '../game/types.ts';
import { BlockInHand } from './BlockInHand.tsx';
import './Game.css';

export function DisplayHand(props: {
  playerIndex: number,
  gameState: GameState,
  pushAction: ActionPusher,
}) {
  const playerHand = props.gameState.hands[props.playerIndex];
  return (
    <div className="player-hand">
      {playerHand.map((newBlock, index) => (
        <BlockInHand
          key = {newBlock.id}
          index = {index}
          newBlock = {newBlock}
          gameState={props.gameState}
          pushAction={props.pushAction}
        />
      ))}
    </div>
  );
}
