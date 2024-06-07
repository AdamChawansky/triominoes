// App.tsx uses playerID in UUID format
// playerID: string | null = localStorage.getItem('playerID');

export type LocalTileInHand = {
  id: string; // "a,b,c,"
  permutation: number; // n * 60 degrees of rotation
}

export function saveTileToLocalStorage(tileId: string, permutation: number) {
  const tilesInHand: LocalTileInHand[] = JSON.parse(localStorage.getItem('tilesInHand') || '[]');
  const tileIndex = tilesInHand.findIndex((tile: LocalTileInHand) => tile.id === tileId);

  if (tileIndex === -1) {
    tilesInHand.push({ id: tileId, permutation });
  } else {
    tilesInHand[tileIndex].permutation = permutation;
  }

  localStorage.setItem('tilesInHand', JSON.stringify(tilesInHand));
}

export function retrieveTilesFromLocalStorage(): LocalTileInHand[] {
  const tilesInHand: LocalTileInHand[] = JSON.parse(localStorage.getItem('tilesInHand') || '[]');
  return tilesInHand;
}

export function updateTilesInLocalStorage(newTilesInHand: LocalTileInHand[]): void {
  localStorage.setItem('tilesInHand', JSON.stringify(newTilesInHand));
}

export function clearTilesFromLocalStorage() {
  localStorage.removeItem('tilesInHand');
}