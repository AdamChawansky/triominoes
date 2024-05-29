import { useEffect, useState } from "react";
import { permuteTile } from "../game/generator";
import { GameState, NewTile } from "../game/types";
import { TileRender } from "./TileRender";
import { retrieveTilesFromLocalStorage, saveTileToLocalStorage } from "../localStorageUtils";

export function TileInHand(props: {
  newTile: NewTile;
  gameState: GameState;
  isSelected: boolean;
  // onClick: () => void;
  setTileInHand: (tile: NewTile | undefined) => void;
}) {
  const [permutation, setPermutation] = useState(() => {
    const tilesInHand = retrieveTilesFromLocalStorage();
    const tileInHand = tilesInHand.find((tile: { id: string }) => tile.id === props.newTile.id);
    return tileInHand ? tileInHand.permutation : 0;
  })

  const permutedTile = permuteTile(props.newTile)[permutation];

  useEffect(() => {
    const tilesInHand = retrieveTilesFromLocalStorage();
    const tileIndex = tilesInHand.findIndex((tile: { id: string }) => tile.id === props.newTile.id);

    if (tileIndex === -1) {
      saveTileToLocalStorage(props.newTile.id, 0);
    }
  }, [props.newTile.id]);

  function onClick() {
    const nextPermutation = (permutation + 1) % 6;
    setPermutation(nextPermutation);
    saveTileToLocalStorage(props.newTile.id, nextPermutation);
  }

  const top = permutedTile.orientation === 'up'
    ? [permutedTile.topCenter]
    : [permutedTile.topLeft, permutedTile.topRight];
  const bottom = permutedTile.orientation === 'up'
    ? [permutedTile.bottomLeft, permutedTile.bottomRight]
    : [permutedTile.bottomCenter];

  function onDragStart(event: React.DragEvent<HTMLDivElement>) {
    event.dataTransfer.setData('text/plain', JSON.stringify(props.newTile));
    props.setTileInHand(props.newTile);
    // console.log('Tile being dragged: ', JSON.stringify(props.newTile));
  }

  return (
    <TileRender 
      top={top}
      bottom={bottom}
      orientation={permutedTile.orientation}
      onClick={onClick}
      tileStyle={props.isSelected ? 'selected' : ''}
      draggable
      onDragStart={onDragStart}
    />
  );
}