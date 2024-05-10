import { searchForMove } from '../game/logic.ts';
import { ActionPusher, Coordinate, GameState, NewBlock, PlayAction } from '../game/types.ts';
import { toCoord, toKey } from '../game/util.ts';
import { BlockOnBoard } from './BlockOnBoard';
import './Game.css';

export function GameBoardView(props: {
  gameState: GameState,
  setGame: (newGame: GameState) => void,
  tileInHand: NewBlock | undefined,
  setTileInHand: (b: NewBlock | undefined) => void,
  pushAction: ActionPusher,
}) {
  // aka const gameState = props.gameState;
  const { gameState, tileInHand, pushAction, setTileInHand } = props;

  function onBlockClick(coord: Coordinate) {
    if(tileInHand) {
      const potentialMoves = searchForMove(tileInHand, gameState.gameBoard);
      const clickedMove = potentialMoves.find(move => move.coord.x === coord.x && move.coord.y === coord.y);

      if(clickedMove) {
        const playTile: PlayAction = {
          actionType: 'play',
          playerIndex: gameState.activePlayer,
          tilePlayed: clickedMove.placedBlock,
          coord: clickedMove.coord,
        }
        pushAction(playTile);
        setTileInHand(undefined);
      }
    }
  }

  return (
    <div className="game-board">
      {Array.from(gameState.gameBoard.entries()).map(([coord, placedBlock]) => (
        <BlockOnBoard
          key = {coord}
          coord = {toCoord(coord)}
          placedBlock = {placedBlock}
          blockStyle={toKey(gameState.lastPlay) === coord ? 'most-recent' : ''}
          onClick={() => onBlockClick(toCoord(coord))}
        />
      ))}
      {tileInHand ? searchForMove(tileInHand, gameState.gameBoard).map(potentialMove => (
        <BlockOnBoard
          key = {toKey(potentialMove.coord)}
          coord = {potentialMove.coord}
          placedBlock = {potentialMove.placedBlock}
          blockStyle={'playable'}
          onClick={() => onBlockClick(potentialMove.coord)}
        />
      )) : null}
    </div>
  );
}