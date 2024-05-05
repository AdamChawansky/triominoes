import { searchForMove } from "../game/logic";
import { ActionPusher, GameState, NewBlock, PlayAction } from "../game/types";
import { BlockRender } from "./BlockRender";

export function BlockInHand(props: {
  newBlock: NewBlock;
  gameState: GameState;
  pushAction: ActionPusher;
  isSelected: boolean;
  onClick: () => void;
}) {
  const top = [props.newBlock.numbers[0]];
  const bottom = [props.newBlock.numbers[2], props.newBlock.numbers[1]];
  
  function onClick() {
    if (props.isSelected) {
      const potentialMove = searchForMove(props.newBlock, props.gameState.gameBoard);

      // FOR LATER: add ability to select where to play tile rather than auto place it
      if(potentialMove.length > 0) {
        const playTile: PlayAction = {
          actionType: 'play',
          playerIndex: props.gameState.activePlayer,
          tilePlayed: potentialMove[0].placedBlock,
          coord: potentialMove[0].coord,
        }
        props.pushAction(playTile);
      }
    } else {
      props.onClick();
    }
  }

  return (
    <BlockRender 
      top={top}
      bottom={bottom}
      orientation={'up'}
      onClick={onClick}
      isPotential={props.isSelected}
    />
  );
}