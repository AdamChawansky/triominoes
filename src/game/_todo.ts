/*
https://en.wikipedia.org/wiki/Triominoes
gameBoard.has("0,0");
gameBoard.get("0,0");
gameBoard.keys();
gameBoard.values();
gameBoard.entries();

Homework:
- Add a rules page or pop-up
- do I even use the add-player action for anything?
--> how is it different between GameState and FirebaseGameData?

KNOWN BUGS:
- PAUL: reloading the page takes you back to JoinGame screen.
- new players joining the game don't automatically show up in GameLog before game starts
- sound effects can trigger multiple times, even though nothing happened because of firebase subscription?
- Reverted gameIsOver code because it wasn't triggering re-render...


FOR LATER:
- Things for local storage:
  - audio preferences
  - display name
  - current gameID
- Create -/+ zoom button for GameBoardView
- Change GameLog wording to gain/loses and color code green/red.
- Figure out why right container takes up whole screen instead of collapsing when screen too narrow.
- Optimize for mobile & tablets
- Add ability for players to undo by selecting point in data log

End states:
  1) A player plays their last tile (any hand[i] === 0)
     That player earns 25 points + the total points of everyone else's tiles
  2) The drawPile is empty and all players pass, meaning no more moves possible.
     Each player loses points equal to sum of their own tiles

Broken Zoom Code:

DisplayGameBoard
  // Allow players to zoom in / out
  const [zoomLevel, setZoomLevel] = useState(1);

  const minZoom = 0.5;
  const maxZoom = 2;
  const zoomStep = 0.1;

  const adjustedWidth = width * zoomLevel;
  const adjustedHeight = height * zoomLevel;

  function handleZoomIn() {
    setZoomLevel(prevZoom => Math.min(prevZoom + zoomStep, maxZoom));
  }

  function handleZoomOut() {
    setZoomLevel(prevZoom => Math.max(prevZoom - zoomStep, minZoom));
  }

   <div className="zoom-buttons">
   <button onClick={handleZoomIn}>+</button>
   <button onClick={handleZoomOut}>-</button>

   
.zoom-buttons {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
}
.zoom-buttons button {
  margin-left: 5px;
  background-color: black;
  color: white;
  border: none;
  padding: 8px 0;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  width: 40px;
  text-align: center;
}
.zoom-buttons button:hover {
  background-color: #333;
}

TileOnBoard
  const adjustedPosition: CSSProperties = {
    ...position,
    left: `${parseFloat(position.left as string) * (zoomLevel ? zoomLevel : 1)}px`,
    bottom: `${parseFloat(position.bottom as string) * (zoomLevel ? zoomLevel : 1)}px`,

TileRender

   const fontSize = 20 * (zoomLevel ? zoomLevel : 1);

   style={{
      ...style,
      width: `${(zoomLevel ? zoomLevel : 1) * 96}px`,
      height: `${(zoomLevel ? zoomLevel : 1) * 96 * .88}px`,
   }}


BROKEN HAND REARRANGE CODE

function onDrop(event: React.DragEvent<HTMLDivElement>) {
  event.preventDefault();
  const droppedTile = JSON.parse(event.dataTransfer.getData('text/plain')) as NewTile;
  const draggedIndex = playerHand.findIndex((tile) => tile.id === droppedTile.id);

  const targetElement = event.target as HTMLElement;
  const droppedOnTileId = targetElement.closest('.tile-in-hand')?.getAttribute('data-tile-id');

  if (droppedOnTileId) {
    const droppedIndex = playerHand.findIndex((tile) => tile.id === droppedOnTileId);

    const newHand = [...playerHand];
    newHand.splice(draggedIndex, 1);
    newHand.splice(droppedIndex, 0, droppedTile);

    localStorage.setItem('playerHand', JSON.stringify(newHand));
  }
}


const [playerHand, setPlayerHand] = useState(() => {
  const storedHand = localStorage.getItem('playerHand');
  return storedHand ? JSON.parse(storedHand) : gameState.hands[playerIndex];
});


TileInHand
<div
  className={`tile-in-hand ${isSelected ? 'selected' : ''}`}
  style={{ ...tilePosition, transform: `${tilePosition!.transform} rotate(${rotation}deg)` }}
  onClick={onClick}
  data-tile-id={newTile.id}
>
</div>



     */