import { CSSProperties } from 'react';
import { Coordinate, PlacedBlock } from "../game/types";
import { TileRender } from './TileRender';

export function TileOnBoard(props: {
  coord: Coordinate;
  placedTile: PlacedBlock;
  tileStyle?: string;
  onClick: () => void;
}) {
  const width = 100;
  const position: CSSProperties = {
    left: `${props.coord.x * width * 0.5}px`,
    bottom: `${props.coord.y * width * 0.866}px`, /* 0.866 coming from width to height ratio of equilateral triangles */
  };

  const top = props.placedTile.orientation === 'up'
    ? [props.placedTile.topCenter]
    : [props.placedTile.topLeft, props.placedTile.topRight];
  const bottom = props.placedTile.orientation === 'up'
    ? [props.placedTile.bottomLeft, props.placedTile.bottomRight]
    : [props.placedTile.bottomCenter];

  return (
    <TileRender 
      style={position}
      top={top}
      bottom={bottom}
      orientation={props.placedTile.orientation}
      blockStyle={props.tileStyle}
      onClick={props.onClick}
    />
  );
}