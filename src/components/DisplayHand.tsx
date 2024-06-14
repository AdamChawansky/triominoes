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
      const newTileOrder = playerHand.map((tile) => tile.id);
      setTileOrder(newTileOrder);
      console.log("Game over, resetting tile order.");
    }
  }, [gameState.gameBoard]);

  // Sort playerHand using tileOrder
  const orderedPlayerHand = playerHand.slice().sort((a, b) => {
    const indexA = tileOrder.indexOf(a.id);
    const indexB = tileOrder.indexOf(b.id);
    return indexA - indexB;
  });

  // Update tileOrder to match playerHand
  useEffect(() => {
    const newTileOrder = playerHand.map((tile) => tile.id);
    setTileOrder((prevTileOrder) => {
      const updatedTileOrder = prevTileOrder.filter((id) => newTileOrder.includes(id));
      const newTiles = newTileOrder.filter((id) => !prevTileOrder.includes(id));
      return [...updatedTileOrder, ...newTiles];
    });
  }, [playerHand]);

  function onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const droppedTile = JSON.parse(event.dataTransfer.getData('text/plain')) as NewTile;
    const draggedIndex = tileOrder.findIndex((id) => id === droppedTile.id);
    console.log("droppedTile: [" + droppedTile.id + "] & draggedIndex: " + draggedIndex);
  
    const targetElement = event.target as HTMLElement;
    const droppedOnTileID = targetElement.closest('.tile-in-hand')?.getAttribute('data-tile-id');
    console.log("droppedOnTileID: " + droppedOnTileID);
    
    if (droppedOnTileID && draggedIndex !== -1) {
      const droppedIndex = tileOrder.findIndex((id) => id === droppedOnTileID);
  
      if (droppedIndex !== -1 && draggedIndex !== droppedIndex) {
        const newTileOrder = [...tileOrder];
        newTileOrder.splice(draggedIndex, 1);
        newTileOrder.splice(droppedIndex, 0, droppedTile.id);
  
        // console.log("newTileOrder: " + newTileOrder);
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