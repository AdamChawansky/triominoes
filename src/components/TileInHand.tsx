import { useEffect, useState } from "react";
import { permuteTile } from "../game/generator";
import { NewTile } from "../game/types";
import { TileRender } from "./TileRender";
import { retrieveTilesFromLocalStorage, saveTileToLocalStorage } from "../localStorageUtils";

export function TileInHand(props: {
  newTile: NewTile;
  isSelected: boolean;
  setTileInHand: (tile: NewTile | undefined) => void;
  soundEffectsEnabled: boolean;
}) {
  const { newTile, isSelected, setTileInHand, soundEffectsEnabled } = props;

  const [permutation, setPermutation] = useState(() => {
    const tilesInHand = retrieveTilesFromLocalStorage();
    const tileInHand = tilesInHand.find((tile: { id: string }) => tile.id === newTile.id);
    return tileInHand ? tileInHand.permutation : 0;
  })

  const permutedTile = permuteTile(newTile)[permutation];

  useEffect(() => {
    const tilesInHand = retrieveTilesFromLocalStorage();
    const tileIndex = tilesInHand.findIndex((tile: { id: string }) => tile.id === newTile.id);

    if (tileIndex === -1) {
      saveTileToLocalStorage(newTile.id, 0);
    }
  }, [newTile.id]);

  // Rotates tile 60 degrees and plays a sound
  function onClick() {
    const nextPermutation = (permutation + 1) % 6;
    setPermutation(nextPermutation);
    saveTileToLocalStorage(newTile.id, nextPermutation);

    if (soundEffectsEnabled) {
      const rotateTileSound = new Audio('../../public/346178-rotate-tile.wav');
      rotateTileSound.play();
    }
  }

  const top = permutedTile.orientation === 'up'
    ? [permutedTile.topCenter]
    : [permutedTile.topLeft, permutedTile.topRight];
  const bottom = permutedTile.orientation === 'up'
    ? [permutedTile.bottomLeft, permutedTile.bottomRight]
    : [permutedTile.bottomCenter];

  function onDragStart(event: React.DragEvent<HTMLDivElement>) {
    event.dataTransfer.setData('text/plain', JSON.stringify(newTile));
    setTileInHand(newTile);
    // console.log('Tile being dragged: ', JSON.stringify(newTile));
  }

  return (
    <TileRender 
      top={top}
      bottom={bottom}
      orientation={permutedTile.orientation}
      onClick={onClick}
      tileStyle={isSelected ? 'selected' : ''}
      draggable
      onDragStart={onDragStart}
    />
  );
}