import { GameState, NewTile } from "../game/types";
import { TileRender } from "./TileRender";

export function TileInHand(props: {
  newTile: NewTile;
  gameState: GameState;
  isSelected: boolean;
  onClick: () => void;
  setTileInHand: (tile: NewTile | undefined) => void;
}) {
  const top = [props.newTile.numbers[0]];
  const bottom = [props.newTile.numbers[2], props.newTile.numbers[1]];
  
  function onClick() {
    props.onClick();
  }

  function onDragStart(event: React.DragEvent<HTMLDivElement>) {
    event.dataTransfer.setData('text/plain', JSON.stringify(props.newTile));
    props.setTileInHand(props.newTile);
    // console.log('Tile being dragged: ', JSON.stringify(props.newTile));
  }

  return (
    <TileRender 
      top={top}
      bottom={bottom}
      orientation={'up'}
      onClick={onClick}
      tileStyle={props.isSelected ? 'selected' : ''}
      draggable
      onDragStart={onDragStart}
    />
  );
}