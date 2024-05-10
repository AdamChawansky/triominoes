import { CSSProperties } from 'react';
import { Coordinate, PlacedBlock } from "../game/types";
import { BlockRender } from './BlockRender';

export function BlockOnBoard(props: {
  coord: Coordinate;
  placedBlock: PlacedBlock;
  blockStyle?: string;
  onClick: () => void;
}) {
  const width = 90;
  const position: CSSProperties = {
    left: `${props.coord.x * width * 0.54}px`,
    bottom: `${props.coord.y * width * 0.95}px`,
  };

  const top = props.placedBlock.orientation === 'up'
    ? [props.placedBlock.topCenter]
    : [props.placedBlock.topLeft, props.placedBlock.topRight];
  const bottom = props.placedBlock.orientation === 'up'
    ? [props.placedBlock.bottomLeft, props.placedBlock.bottomRight]
    : [props.placedBlock.bottomCenter];

  return (
    <BlockRender 
      style={position}
      top={top}
      bottom={bottom}
      orientation={props.placedBlock.orientation}
      blockStyle={props.blockStyle}
      onClick={props.onClick}
    />
  );
}