import { ActionPusher, GameState, NewBlock } from '../game/types.ts';
import { BlockInHand } from './BlockInHand.tsx';
import './Game.css';

export function DisplayHand(props: {
  playerIndex: number,
  gameState: GameState,
  pushAction: ActionPusher,
  tileInHand: NewBlock | undefined,
  setTileInHand: (b: NewBlock | undefined) => void,
}) {
  const playerHand = props.gameState.hands[props.playerIndex];

  function onClick(tileInHand: NewBlock) {
    props.setTileInHand(tileInHand);
  }

  return (
    <div className="player-hand">
      {playerHand.map((newBlock, index) => (
        <BlockInHand
          key = {newBlock.id}
          index = {index}
          newBlock = {newBlock}
          gameState={props.gameState}
          pushAction={props.pushAction}
          isSelected={newBlock.id === props.tileInHand?.id}
          onClick={() => onClick(newBlock)}
        />
      ))}
    </div>
  );
}
