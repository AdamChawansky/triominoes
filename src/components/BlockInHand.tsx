import { NewBlock } from "../game/types";
import { BlockRender } from "./BlockRender";

export function BlockInHand(props: {
  index: number;
  newBlock: NewBlock;
  // gameState: GameState;
  // setGame: (newGame: GameBoard) => void;
}) {
  const top = [props.newBlock.numbers[0]];
  const bottom = [props.newBlock.numbers[2], props.newBlock.numbers[1]];

  return (
    <BlockRender 
      top={top}
      bottom={bottom}
      orientation={'up'}
    />
  );
}