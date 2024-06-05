import { useEffect, useState } from "react";
import { NewTile } from "../game/types";
import { retrieveTilesFromLocalStorage, saveTileToLocalStorage } from "../localStorageUtils";
import './TileInHand.css'
import { isElementOfType } from "react-dom/test-utils";

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

  useEffect(() => {
    const tilesInHand = retrieveTilesFromLocalStorage();
    const tileIndex = tilesInHand.findIndex((tile: { id: string }) => tile.id === newTile.id);

    if (tileIndex === -1) {
      saveTileToLocalStorage(newTile.id, 0);
    }
  }, [newTile.id]);

  // Rotates tile 60 degrees and plays a sound
  function onClick() {
    const nextPermutation = (permutation + 1);
    setPermutation(nextPermutation);
    saveTileToLocalStorage(newTile.id, nextPermutation);
    setTileInHand(newTile);

    if (soundEffectsEnabled) {
      const rotateTileSound = new Audio('../../public/346178-rotate-tile.wav');
      rotateTileSound.play();
    }
  }

  const rotation = permutation * 60; // Calculate the rotation angle based upon permutation

  // Calculate the position of the tile based on the rotation angle
  const tilePosition = {
      0: { transform: 'translate(  0%,   0%)' },
     60: { transform: 'translate( 13%, -20%)' },
    120: { transform: 'translate( 13%,  27%)' },
    180: { transform: 'translate(  0%,   6%)' },
    240: { transform: 'translate(-13%,  27%)' },
    300: { transform: 'translate(-15%, -20%)' },
  }[rotation % 360];

  // Code below is used to define clip-path polygon for dragging rotated tiles
  // Previous implementations had the issue of ghosted triangle not matching current 
  // orientation as well as dragged elements not aligning with image for dropping
  const [isDragging, setIsDragging] = useState(false);

  function onDragStart(event: React.DragEvent<HTMLDivElement>) {
    event.dataTransfer.setData('text/plain', JSON.stringify(newTile));
    setTileInHand(newTile);
    setIsDragging(true);
    // console.log('Tile being dragged: ', JSON.stringify(newTile));
  }

  function onDragEnd() {
    setIsDragging(false);
  }

  const dragClass = isDragging ? (rotation % 120 === 0? 'tile-dragging' : 'tile-dragging-inverted') : '';

  return (
    <div
      className={`${dragClass}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div
        className={`tile-in-hand ${isSelected ? 'selected' : ''}`}
        style={{ ...tilePosition, transform: `${tilePosition!.transform} rotate(${rotation}deg)` }}
        onClick={onClick}
      >
        <div className="number-container">
          <span className="number top-center">{newTile.numbers[0]}</span>
          <span className="number bottom-right">{newTile.numbers[1]}</span>
          <span className="number bottom-left">{newTile.numbers[2]}</span>
        </div>
      </div>
    </div>
  );
}