import { GameState, NewTile } from '../game/types.ts';
import { TileInHand } from './TileInHand.tsx';
import './Game.css';

export function DisplayHand(props: {
  playerIndex: number,
  gameState: GameState,
  tileInHand: NewTile | undefined,
  setTileInHand: (b: NewTile | undefined) => void,
}) {
  // const playerHand = props.gameState.hands[props.playerIndex];
  const playerHand = props.gameState.hands[props.gameState.activePlayer];

  function onClick(tileInHand: NewTile) {
    if(props.tileInHand?.id === tileInHand.id) {
      props.setTileInHand(undefined);
    } else {
      props.setTileInHand(tileInHand);
    }
  }

  return (
    <div className="player-hand">
      {playerHand.map((newTile) => (
        <TileInHand
          key = {newTile.id}
          newTile = {newTile}
          gameState={props.gameState}
          isSelected={newTile.id === props.tileInHand?.id}
          onClick={() => onClick(newTile)}
        />
      ))}
    </div>
  );
}