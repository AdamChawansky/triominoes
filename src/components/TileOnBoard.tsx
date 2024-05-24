import { CSSProperties } from 'react';
import { Coordinate, PlacedTile } from "../game/types";
import { TileRender } from './TileRender';

export function TileOnBoard(props: {
  coord: Coordinate;
  placedTile: PlacedTile;
  tileStyle?: string;
  onClick: () => void;
  onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
  position: CSSProperties;
}) {
  const top = props.placedTile.orientation === 'up'
    ? [props.placedTile.topCenter]
    : [props.placedTile.topLeft, props.placedTile.topRight];
  const bottom = props.placedTile.orientation === 'up'
    ? [props.placedTile.bottomLeft, props.placedTile.bottomRight]
    : [props.placedTile.bottomCenter];

  return (
    <TileRender 
      style={props.position}
      top={top}
      bottom={bottom}
      orientation={props.placedTile.orientation}
      tileStyle={props.tileStyle}
      onClick={props.onClick}
      onDragOver={props.onDragOver}
      onDrop={props.onDrop}
    />
  );
}