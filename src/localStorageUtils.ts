// App.tsx uses playerID in UUID format
// playerID: string | null = localStorage.getItem('playerID');

import { NewTile } from "./game/types";

export function saveTileToLocalStorage(tileId: string, tileNumbers: [number, number, number], tileTimesRotated: number) {
  const tilesInHand: NewTile[] = JSON.parse(localStorage.getItem('tilesInHand') || '[]');
  const tileIndex = tilesInHand.findIndex((tile: NewTile) => tile.id === tileId);

  if (tileIndex === -1) {
    tilesInHand.push({ id: tileId, numbers: tileNumbers, timesRotated: tileTimesRotated });
  } else {
    tilesInHand[tileIndex].timesRotated = tileTimesRotated;
  }

  localStorage.setItem('tilesInHand', JSON.stringify(tilesInHand));
}

export function retrieveTilesFromLocalStorage(): NewTile[] {
  const tilesInHand: NewTile[] = JSON.parse(localStorage.getItem('tilesInHand') || '[]');
  return tilesInHand;
}

export function updateTilesInLocalStorage(newTilesInHand: NewTile[]): void {
  localStorage.setItem('tilesInHand', JSON.stringify(newTilesInHand));
}

export function clearTilesFromLocalStorage() {
  localStorage.removeItem('tilesInHand');
}