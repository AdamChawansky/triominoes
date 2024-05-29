export function saveTileToLocalStorage(tileId: string, permutation: number) {
    const tilesInHand = JSON.parse(localStorage.getItem('tilesInHand') || '[]');
    const tileIndex = tilesInHand.findIndex((tile: { id: string }) => tile.id === tileId);
  
    if (tileIndex === -1) {
      tilesInHand.push({ id: tileId, permutation });
    } else {
      tilesInHand[tileIndex].permutation = permutation;
    }
  
    localStorage.setItem('tilesInHand', JSON.stringify(tilesInHand));
    // console.log("Saved TilesInHand: ", tilesInHand);
}

export function retrieveTilesFromLocalStorage() {
    const tilesInHand = JSON.parse(localStorage.getItem('tilesInHand') || '[]');
    // console.log("Retrieved TilesInHand: ", tilesInHand);
    return tilesInHand;
}

export function clearTilesFromLocalStorage() {
    localStorage.removeItem('tilesInHand');
}