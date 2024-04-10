import { CSSProperties } from 'react';
import { NewBlock } from "../game/types";

export function BlockInHand(props: {
  index: number;
  newBlock: NewBlock;
  // gameState: GameState;
  // setGame: (newGame: GameBoard) => void;
}) {
  const width = 90;
  const position: CSSProperties = {
    left: `${props.index * width * 0.54}px`,
    bottom: `${0 * width * 0.95}px`,
  };

  const top = [props.newBlock.numbers[0]];
  const bottom = [props.newBlock.numbers[2], props.newBlock.numbers[1]];

  function onClick() {

  }

  const classNames = [
    'block', 
    'block-up',
  ];
  return (
    <div className={classNames.join(' ')} style={position} onClick={onClick}>
      <div>{top.join(' ')}</div>
      <div>{bottom.join(' ')}</div>
    </div>
  );
}