import { GameState, NewTile } from '../game/types.ts';
import { TileInHand } from './TileInHand.tsx';
import './DisplayHand.css';
import { useState } from 'react';
import { retrieveTilesFromLocalStorage, updateTilesInLocalStorage } from '../localStorageUtils.ts';

export function DisplayHand(props: {
  playerIndex: number,
  gameState: GameState,
  tileInHand: NewTile | undefined,
  setTileInHand: (b: NewTile | undefined) => void,
  soundEffectsEnabled: boolean,
}) {
  const { playerIndex, gameState, tileInHand, setTileInHand, soundEffectsEnabled } = props;

  // ADMIN: displays hand of activePlayer, otherwise display hand of local player
  // NOTE: the ADMIN code might not work with the new localPlayerHand
  const [localPlayerHand, setLocalPlayerHand] = useState(() => {
    const storedHand = retrieveTilesFromLocalStorage();
    return storedHand ? storedHand : gameState.hands[playerIndex];
  });

  function onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const droppedTile = JSON.parse(event.dataTransfer.getData('text/plain')) as NewTile;
    const draggedIndex = localPlayerHand.findIndex((tile) => tile.id === droppedTile.id);
  
    const targetElement = event.target as HTMLElement;
    const droppedOnTileId = targetElement.closest('.tile-in-hand')?.getAttribute('data-tile-id');
  
    if (droppedOnTileId) {
      const droppedIndex = localPlayerHand.findIndex((tile) => tile.id === droppedOnTileId);
  
      const newHand = [...localPlayerHand];
      newHand.splice(draggedIndex, 1);
      newHand.splice(droppedIndex, 0, droppedTile);
  
      setLocalPlayerHand(newHand);
      updateTilesInLocalStorage(newHand);
    }
  }

  if( gameState.gameBoard.size === 0 ) {
    return (<div></div>);
  } else {
    return (
      <div className="player-hand"
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {localPlayerHand.map((newTile) => (
          <TileInHand
            key={newTile.id}
            newTile={newTile}
            isSelected={newTile.id === tileInHand?.id}
            setTileInHand={setTileInHand}
            soundEffectsEnabled={soundEffectsEnabled}
          />
        ))}
      </div>
    );
  }
}