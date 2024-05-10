import { GameState, NewBlock } from "../game/types";
import { BlockRender } from "./BlockRender";

export function BlockInHand(props: {
  newBlock: NewBlock;
  gameState: GameState;
  isSelected: boolean;
  onClick: () => void;
}) {
  const top = [props.newBlock.numbers[0]];
  const bottom = [props.newBlock.numbers[2], props.newBlock.numbers[1]];
  
  function onClick() {
    props.onClick();
  }

  return (
    <BlockRender 
      top={top}
      bottom={bottom}
      orientation={'up'}
      onClick={onClick}
      blockStyle={props.isSelected ? 'selected' : ''}
    />
  );
}