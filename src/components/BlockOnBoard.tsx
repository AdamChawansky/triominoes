import { CSSProperties } from 'react';
import { Coordinate, PlacedBlock } from "../game/types";

export function BlockOnBoard(props: {
  coord: Coordinate;
  placedBlock: PlacedBlock;
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

  function onClick() {
    console.log('i clicked on:', props.placedBlock);
  }

  const classNames = [
    'block', 
    props.placedBlock.orientation === 'up'
      ? 'block-up'
      : 'block-down',
  ];
  return (
    <div className={classNames.join(' ')} style={position} onClick={onClick}>
      <div>{top.join(' ')}</div>
      <div>{bottom.join(' ')}</div>
    </div>
  );
}