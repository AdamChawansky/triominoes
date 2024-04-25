import { GameState } from '../game/types.ts';
import { toCoord } from '../game/util.ts';
import { BlockOnBoard } from './BlockOnBoard';
import './Game.css';

export function GameBoardView(props: {
  gameState: GameState;
  setGame: (newGame: GameState) => void;
}) {
  // aka const gameState = props.gameState;
  const { gameState, setGame } = props;
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
    </div>
  );
}
