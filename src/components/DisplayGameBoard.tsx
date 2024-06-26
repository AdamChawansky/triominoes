import { searchForMove } from '../game/logic.ts';
import { ActionPusher, Coordinate, GameState, NewTile, PlayAction } from '../game/types.ts';
import { toCoord, toKey } from '../game/util.ts';
import { TileOnBoard } from './TileOnBoard.tsx';
import './DisplayGameBoard.css';
import { useEffect, useRef, useState } from 'react';

export function GameBoardView(props: {
  gameState: GameState,
  tileInHand: NewTile | undefined,
  setTileInHand: (b: NewTile | undefined) => void,
  pushAction: ActionPusher,
  isActivePlayer: boolean,
  moveHighlightingEnabled: boolean,
}) {
  // aka const gameState = props.gameState;
  const { gameState, tileInHand, pushAction, setTileInHand, isActivePlayer, moveHighlightingEnabled } = props;

  // Adjust width based on screen size (i.e., desktop or mobile)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Grab gameBoard height & width to keep tiles centered
  const gameBoardRef = useRef<HTMLDivElement>(null);
  const [gameBoardWidth, setGameBoardWidth] = useState(0);
  const [gameBoardHeight, setGameBoardHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (gameBoardRef.current) {
        setGameBoardWidth(gameBoardRef.current.clientWidth);
        setGameBoardHeight(gameBoardRef.current.clientHeight);
      }
    };
  
    handleResize();
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const width = isMobile ? 57.6 : 96;
  const height = width * 0.88;

  const placedTilesWithCoords = Array.from(gameState.gameBoard.entries());

  // Find min & max X & Y coordinates
  const minX = Math.min(...placedTilesWithCoords.map(([coord]) => toCoord(coord).x));
  const maxX = Math.max(...placedTilesWithCoords.map(([coord]) => toCoord(coord).x));
  const minY = Math.min(...placedTilesWithCoords.map(([coord]) => toCoord(coord).y));
  const maxY = Math.max(...placedTilesWithCoords.map(([coord]) => toCoord(coord).y));

  const boardWidth = (maxX - minX + 1) * width * 0.5;
  const boardHeight = (maxY - minY + 1) * height;

  const offsetX = (gameBoardWidth - boardWidth) / 2;
  const offsetY = (gameBoardHeight - boardHeight) / 2;

  // Allow players to place tiles in available spaces based on selected tileInHand
  function onBlockClick(coord: Coordinate) {
    if( isActivePlayer && tileInHand ) {
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

  // Allow players to place tiles in available spaces by dragging and dropping
  function onBlockDrop(event: React.DragEvent<HTMLDivElement>, coord: Coordinate) {
    if( isActivePlayer ) {
      event.preventDefault();
      const tileData = event.dataTransfer.getData('text/plain');
      // console.log('Tile Data: ', tileData);
      const droppedTile: NewTile = JSON.parse(tileData);
      // console.log('Dropped Tile: ', droppedTile);

      const potentialMoves = searchForMove(droppedTile, gameState.gameBoard);
      // console.log('Potential Moves: ', potentialMoves);
      const droppedMove = potentialMoves.find(move => move.coord.x === coord.x && move.coord.y === coord.y);
      // console.log('Dropped Move: ', droppedMove);

      if(droppedMove) {
        const playTile: PlayAction = {
          actionType: 'play',
          playerIndex: gameState.activePlayer,
          tilePlayed: droppedMove.placedTile,
          coord: droppedMove.coord,
        }
        pushAction(playTile);
        setTileInHand(undefined);
      }
    }
  }

  return (
    <div className="game-board" ref={gameBoardRef}>
      {Array.from(gameState.gameBoard.entries()).map(([coord, placedBlock]) => (
        <TileOnBoard
          key = {coord}
          coord = {toCoord(coord)}
          placedTile = {placedBlock}
          tileStyle={toKey(gameState.lastPlay) === coord ? 'most-recent' : ''}
          // onClick={() => onBlockClick(toCoord(coord))}
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
          tileStyle = {moveHighlightingEnabled ? 'playable-visible' : 'playable-hidden'}
          onClick = {() => onBlockClick(potentialMove.coord)}
          onDragOver = {(event) => event.preventDefault()}
          onDrop = {(event) => onBlockDrop(event, potentialMove.coord)}
          position = {{
            left: `${(potentialMove.coord.x - minX) * width * 0.5 + offsetX}px`,
            bottom: `${(potentialMove.coord.y - minY) * height + offsetY}px`,
          }}
        />
      )) : null}
    </div>
  );
}