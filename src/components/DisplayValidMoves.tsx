import { searchForMove } from '../game/logic.ts';
import { GameState, NewBlock } from '../game/types.ts';
import { toKey } from '../game/util.ts';
import { BlockOnBoard } from './BlockOnBoard';
import './Game.css';

export function DisplayValidMoves(props: {
  // tileInHand: NewBlock;
  gameState: GameState;
  setGame: (newGame: GameState) => void;
}) {
  // aka const gameState = props.gameState;
  const { gameState, setGame } = props;
  const tileInHand = gameState.hands[0][0];
  return (
    <div className="valid-moves">
      {searchForMove(tileInHand, gameState.gameBoard).map(potentialMove => (
        <BlockOnBoard
          key = {toKey(potentialMove.coord)}
          coord = {potentialMove.coord}
          placedBlock = {potentialMove.placedBlock}
          game={gameState}
          setGame={setGame}
        />
      ))}
    </div>
  );
}