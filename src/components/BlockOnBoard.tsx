import { CSSProperties } from 'react';
import { Coordinate, PlacedBlock } from "../game/types";

export function BlockOnBoard(props: {
  coord: Coordinate;
  placedBlock: PlacedBlock;
}) {
  const position: CSSProperties = {
    left: `${props.coord.x * 80}px`,
    bottom: `${props.coord.y * 80}px`,
  };

  const top = props.placedBlock.orientation === 'up'
    ? [props.placedBlock.topCenter]
    : [props.placedBlock.topLeft, props.placedBlock.topRight];
  const bottom = props.placedBlock.orientation === 'up'
    ? [props.placedBlock.bottomLeft, props.placedBlock.bottomRight]
    : [props.placedBlock.bottomCenter];

  function onClick() {
    console.log('i clicked on:', props.placedBlock);
  }

  return (
    <div className="triangular-block-up" style={position} onClick={onClick}>
      <div>{top.join(' ')}</div>
      <div>{bottom.join(' ')}</div>
    </div>
  );
}