import { searchForMove } from '../game/logic.ts';
import { GameState } from '../game/types.ts';
import { toCoord, toKey } from '../game/util.ts';
import { BlockOnBoard } from './BlockOnBoard';
import './Game.css';

export function GameBoardView(props: {
  gameState: GameState;
  setGame: (newGame: GameState) => void;
}) {
  // aka const gameState = props.gameState;
  const { gameState, setGame } = props;
  const tileInHand = gameState.hands[0][1];
  return (
    <div className="game-board">
      {Array.from(gameState.gameBoard.entries()).map(([coord, placedBlock]) => (
        <BlockOnBoard
          key = {coord}
          coord = {toCoord(coord)}
          placedBlock = {placedBlock}
          game={gameState}
          setGame={setGame}
        />
      ))}
      {searchForMove(tileInHand, gameState.gameBoard).map(potentialMove => (
        <BlockOnBoard
          key = {toKey(potentialMove.coord)}
          coord = {potentialMove.coord}
          placedBlock = {potentialMove.placedBlock}
          game={gameState}
          setGame={setGame}
          isPotential={true}
        />
      ))}
    </div>
  );
}