import { searchForMove } from "../game/logic";
import { ActionPusher, GameState, NewBlock, PlayAction } from "../game/types";
import { BlockRender } from "./BlockRender";

export function BlockInHand(props: {
  index: number; // PAUL: what does this index refer to? Do we need it?
  newBlock: NewBlock;
  gameState: GameState;
  pushAction: ActionPusher;
}) {
  const top = [props.newBlock.numbers[0]];
  const bottom = [props.newBlock.numbers[2], props.newBlock.numbers[1]];
  
  function onClick() {
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
  }

  return (
    <BlockRender 
      top={top}
      bottom={bottom}
      orientation={'up'}
      onClick={onClick}
    />
  );
}