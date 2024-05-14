import { searchForMove } from '../game/logic.ts';
import { ActionPusher, Coordinate, GameState, NewTile, PlayAction } from '../game/types.ts';
import { toCoord, toKey } from '../game/util.ts';
import { TileOnBoard } from './TileOnBoard.tsx';
import './Game.css';
import { useEffect, useState } from 'react';

export function GameBoardView(props: {
  gameState: GameState,
  setGame: (newGame: GameState) => void,
  tileInHand: NewTile | undefined,
  setTileInHand: (b: NewTile | undefined) => void,
  pushAction: ActionPusher,
}) {
  // aka const gameState = props.gameState;
  const { gameState, tileInHand, pushAction, setTileInHand } = props;
  const [playAreaWidth, setPlayAreaWidth] = useState(window.innerWidth);
  const [playAreaHeight, setPlayAreaHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setPlayAreaWidth(window.innerWidth);
      setPlayAreaHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  function onBlockClick(coord: Coordinate) {
    if(tileInHand) {
      const potentialMoves = searchForMove(tileInHand, gameState.gameBoard);
      const clickedMove = potentialMoves.find(move => move.coord.x === coord.x && move.coord.y === coord.y);

      if(clickedMove) {
        const playTile: PlayAction = {
          actionType: 'play',
          playerIndex: gameState.activePlayer,
          tilePlayed: clickedMove.placedTile,
          coord: clickedMove.coord,
        }
        pushAction(playTile);
        setTileInHand(undefined);
      }
    }
  }

  const width = 96;
  const height = width * 0.88;

  const placedTilesWithCoords = Array.from(gameState.gameBoard.entries());

  const minX = Math.min(...placedTilesWithCoords.map(([coord]) => toCoord(coord).x));
  const maxX = Math.max(...placedTilesWithCoords.map(([coord]) => toCoord(coord).x));
  const minY = Math.min(...placedTilesWithCoords.map(([coord]) => toCoord(coord).y));
  const maxY = Math.max(...placedTilesWithCoords.map(([coord]) => toCoord(coord).y));

  const boardWidth = (maxX - minX + 1) * width * 0.5;
  const boardHeight = (maxY - minY + 1) * height;

  const offsetX = (playAreaWidth - boardWidth) / 2;
  const offsetY = (playAreaHeight - boardHeight) / 2;

  return (
    <div className="game-board">
      {Array.from(gameState.gameBoard.entries()).map(([coord, placedBlock]) => (
        <TileOnBoard
          key = {coord}
          coord = {toCoord(coord)}
          placedTile = {placedBlock}
          tileStyle={toKey(gameState.lastPlay) === coord ? 'most-recent' : ''}
          onClick={() => onBlockClick(toCoord(coord))}
          position={{
            left: `${(toCoord(coord).x - minX) * width * 0.5 + offsetX}px`,
            bottom: `${(toCoord(coord).y - minY) * height + offsetY}px`,
          }}
        />
      ))}
      {tileInHand ? searchForMove(tileInHand, gameState.gameBoard).map(potentialMove => (
        <TileOnBoard
          key = {toKey(potentialMove.coord)}
          coord = {potentialMove.coord}
          placedTile = {potentialMove.placedTile}
          tileStyle={'playable'}
          onClick={() => onBlockClick(potentialMove.coord)}
          position={{
            left: `${(potentialMove.coord.x - minX) * width * 0.5 + offsetX}px`,
            bottom: `${(potentialMove.coord.y - minY) * height + offsetY}px`,
          }}
        />
      )) : null}
    </div>
  );
}