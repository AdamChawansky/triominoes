import { CSSProperties } from 'react';
import { Coordinate, GameBoard, PlacedBlock } from "../game/types";
import { toKey } from '../game/util';

export function BlockOnBoard(props: {
  coord: Coordinate;
  placedBlock: PlacedBlock;
  game: GameBoard;
  setGame: (newGame: GameBoard) => void;
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
    const newGame = new Map(props.game);
    newGame.delete(toKey(props.coord));
    props.setGame(newGame);
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