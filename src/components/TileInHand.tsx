import { GameState, NewTile } from "../game/types";
import { TileRender } from "./TileRender";

export function TileInHand(props: {
  newTile: NewTile;
  gameState: GameState;
  isSelected: boolean;
  onClick: () => void;
}) {
  const top = [props.newTile.numbers[0]];
  const bottom = [props.newTile.numbers[2], props.newTile.numbers[1]];
  
  function onClick() {
    props.onClick();
  }

  return (
    <TileRender 
      top={top}
      bottom={bottom}
      orientation={'up'}
      onClick={onClick}
      tileStyle={props.isSelected ? 'selected' : ''}
    />
  );
}