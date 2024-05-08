import { searchForMove } from '../game/logic.ts';
import { GameState, NewBlock } from '../game/types.ts';
import { toCoord, toKey } from '../game/util.ts';
import { BlockOnBoard } from './BlockOnBoard';
import './Game.css';

export function GameBoardView(props: {
  gameState: GameState,
  setGame: (newGame: GameState) => void,
  tileInHand: NewBlock | undefined,
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
          blockStyle={toKey(gameState.lastPlay) === coord ? 'most-recent' : ''}
        />
      ))}
      {props.tileInHand ? searchForMove(props.tileInHand, gameState.gameBoard).map(potentialMove => (
        <BlockOnBoard
          key = {toKey(potentialMove.coord)}
          coord = {potentialMove.coord}
          placedBlock = {potentialMove.placedBlock}
          game={gameState}
          setGame={setGame}
          blockStyle={'playable'}
        />
      )) : null}
    </div>
  );
}