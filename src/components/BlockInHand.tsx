import { NewBlock } from "../game/types";

export function BlockInHand(props: {
  index: number;
  newBlock: NewBlock;
  // gameState: GameState;
  // setGame: (newGame: GameBoard) => void;
}) {
  const top = [props.newBlock.numbers[0]];
  const bottom = [props.newBlock.numbers[2], props.newBlock.numbers[1]];

  function onClick() {

  }

  const classNames = [
    'block', 
    'block-up',
  ];
  return (
    <div className={classNames.join(' ')} onClick={onClick}>
      <div>{top.join(' ')}</div>
      <div>{bottom.join(' ')}</div>
    </div>
  );
}