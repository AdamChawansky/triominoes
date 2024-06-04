import { useEffect, useState } from "react";
import { NewTile } from "../game/types";
import { retrieveTilesFromLocalStorage, saveTileToLocalStorage } from "../localStorageUtils";
import './TileInHand.css'

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
      0: { top: '0',    left: '50%',   transform: 'translate(-50%, 0)' },
     60: { top: '25%',  left: '93.3%', transform: 'translate(-80%, -50%)' },
    120: { top: '75%',  left: '93.3%', transform: 'translate(-80%, -50%)' },
    180: { top: '100%', left: '50%',   transform: 'translate(-50%, -100%)' },
    240: { top: '75%',  left: '6.7%',  transform: 'translate(-20%, -50%)' },
    300: { top: '25%',  left: '6.7%',  transform: 'translate(-20%, -50%)' },
  }[rotation % 360];
  
  function onDragStart(event: React.DragEvent<HTMLDivElement>) {
    event.dataTransfer.setData('text/plain', JSON.stringify(newTile));
    setTileInHand(newTile);
    // console.log('Tile being dragged: ', JSON.stringify(newTile));
  }

  return (
    <div
      className={`tile-in-hand ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
    >
      <div className="tile-content" style={{ ...tilePosition, transform: `${tilePosition!.transform} rotate(${rotation}deg)` }}>
        <span className="number top-center">{newTile.numbers[0]}</span>
        <span className="number bottom-right">{newTile.numbers[1]}</span>
        <span className="number bottom-left">{newTile.numbers[2]}</span>
      </div>
    </div>
  );

  // return (
  //   <div
  //     className="tile-holder"
  //     style={{ transform: `rotate(${rotation}deg)` }}
  //     onClick={onClick}
  //     draggable
  //     onDragStart={onDragStart}
  //   >
  //     <div className={`tile-in-hand ${isSelected ? 'selected' : ''}`}>
  //       <span className="number top-center">{newTile.numbers[0]}</span>
  //       <span className="number bottom-right">{newTile.numbers[1]}</span>
  //       <span className="number bottom-left">{newTile.numbers[2]}</span>
  //     </div>
  //   </div>
  // );

  // return (
  //   <div
  //     className={`tile-in-hand ${isSelected ? 'selected' : ''}`}
  //     style={{ transform: `rotate(${rotation}deg)` }}
  //     onClick={onClick}
  //     draggable
  //     onDragStart={onDragStart}
  //   >
  //     <span className="number top-center">{newTile.numbers[0]}</span>
  //     <span className="number bottom-right">{newTile.numbers[1]}</span>
  //     <span className="number bottom-left">{newTile.numbers[2]}</span>
  //   </div>
  // );
}