import { GameState, NewBlock } from '../game/types.ts';
import { TileInHand } from './TileInHand.tsx';
import './Game.css';

export function DisplayHand(props: {
  playerIndex: number,
  gameState: GameState,
  tileInHand: NewBlock | undefined,
  setTileInHand: (b: NewBlock | undefined) => void,
}) {
  const playerHand = props.gameState.hands[props.playerIndex];

  function onClick(tileInHand: NewBlock) {
    if(props.tileInHand?.id === tileInHand.id) {
      props.setTileInHand(undefined);
    } else {
      props.setTileInHand(tileInHand);
    }
  }

  return (
    <div className="player-hand">
      {playerHand.map((newBlock) => (
        <TileInHand
          key = {newBlock.id}
          newBlock = {newBlock}
          gameState={props.gameState}
          isSelected={newBlock.id === props.tileInHand?.id}
          onClick={() => onClick(newBlock)}
        />
      ))}
    </div>
  );
}