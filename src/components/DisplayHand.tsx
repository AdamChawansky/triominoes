import { GameState, NewTile } from '../game/types.ts';
import { TileInHand } from './TileInHand.tsx';
import './DisplayHand.css';
import { useEffect, useState } from 'react';

export function DisplayHand(props: {
  playerIndex: number,
  gameState: GameState,
  tileInHand: NewTile | undefined,
  setTileInHand: (tile: NewTile | undefined) => void,
  soundEffectsEnabled: boolean,
}) {
  const { playerIndex, gameState, tileInHand, setTileInHand, soundEffectsEnabled } = props;

  const playerHand = gameState.hands[playerIndex];

  // Array of tile.id to track order of playerHand locally
  const [tileOrder, setTileOrder] = useState(() => {
    return playerHand.map((tile) => tile.id);
  });

  // Reset tileOrder when the game ends
  useEffect(() => {
    if (gameState.gameBoard.size === 0) {
      setTileOrder([]);
    }
  }, [gameState.gameBoard]);

  // Sort playerHand using tileOrder
  const orderedPlayerHand: NewTile[] = [];
  for (let i = 0; i < tileOrder.length; i++) {
    const tileIndex = playerHand.findIndex((tile) => tile.id === tileOrder[i]);
    if (tileIndex === -1) {
      tileOrder.splice(i, 1);
    } else {
      orderedPlayerHand.push(playerHand[tileIndex]);
    }
  }

  // Add any remaining tiles from playerHand to the end of orderedPlayerHand
  for (const tile of playerHand) {
    if (!orderedPlayerHand.includes(tile)) {
      orderedPlayerHand.push(tile);
      setTileOrder([...tileOrder, tile.id]);
    }
  }

  function onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const droppedTile = JSON.parse(event.dataTransfer.getData('text/plain')) as NewTile;
    const draggedIndex = tileOrder.findIndex((id) => id === droppedTile.id);
  
    const targetElement = event.target as HTMLElement;
    const droppedOnTileId = targetElement.closest('.tile-in-hand')?.getAttribute('data-tile-id');
  
    if (droppedOnTileId && draggedIndex !== -1) {
      const droppedIndex = tileOrder.findIndex((id) => id === droppedOnTileId);
  
      if (droppedIndex !== -1 && draggedIndex !== droppedIndex) {
        const newTileOrder = [...tileOrder];
        newTileOrder.splice(draggedIndex, 1);
        newTileOrder.splice(droppedIndex, 0, droppedTile.id);
  
        setTileOrder(newTileOrder);
      }
    }
  }

  if (gameState.gameBoard.size === 0 || playerIndex === -1) {
    return (<div></div>);
  } else {
    return (
      <div className="player-hand">
        {orderedPlayerHand.map((newTile) => (
          <TileInHand
            key={newTile.id}
            newTile={newTile}
            isSelected={newTile.id === tileInHand?.id}
            setTileInHand={setTileInHand}
            soundEffectsEnabled={soundEffectsEnabled}
            onDrop={onDrop}
          />
        ))}
      </div>
    );
  }
}