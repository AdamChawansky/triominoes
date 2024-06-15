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

  // playerHand order will always hold tiles in the order they were drawn
  // tileOrder will store initial order of playerHand as string of tile.id
  // orderedPlayerHand is then used to render the TilesInHand
  // Players can swap tiles in hand by dragging and dropping
  // tileOrder and orderedPlayerHand should be updated whenever anything changes state
  // A change to any of the 3 should cause all 3 to refresh
  const [tileOrder, setTileOrder] = useState(() => {
    return playerHand.map((tile) => tile.id);
  });

  // Reset tileOrder when a new game is initialized
  useEffect(() => {
    if (gameState.gameBoard.size === 1) {
      const newGameTileOrder = playerHand.map((tile) => tile.id);
      setTileOrder(newGameTileOrder);
      console.log("Game over, resetting tile order.");
    }
  }, [gameState.gameBoard]);

  // Generate orderedPlayerHand by sorting playerHand using tileOrder
  // FOR PAUL: Does this need to be wrapped in a useEffect() whenever tileOrder changes?
  //           It seems like it's running everytime gameState updates
  const orderedPlayerHand: NewTile[] = playerHand.slice().sort((a, b) => {
    const indexA = tileOrder.indexOf(a.id);
    const indexB = tileOrder.indexOf(b.id);
    return indexA - indexB;
  });
  console.log("orderedPlayerHand: " + orderedPlayerHand.map((tile) => tile.id));

  // If player draws or plays a tile, update tileOrder
  useEffect(() => {
    const newTileOrder = playerHand.map((tile) => tile.id);
    setTileOrder((prevTileOrder) => {
      // Remove tiles that no longer exist in playerHand
      const updatedTileOrder = prevTileOrder.filter((id) => newTileOrder.includes(id));
      // Add new tiles to end of playerHand
      const newTiles = newTileOrder.filter((id) => !prevTileOrder.includes(id));
      console.log("playerHand Changed");
      console.log("New playerHand: " + playerHand.map((tile) => tile.id));
      console.log("Updated tileOrder: " + [...updatedTileOrder, ...newTiles]);
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
  
        console.log("Order after dragging: " + newTileOrder);
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