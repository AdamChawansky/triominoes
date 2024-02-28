import { makeNewBlocks, permuteBlock } from "./generator";
import { NewBlock, PlacedBlock, PlacedBlockA, PlacedBlockB, Coordinate, GameBoard, PotentialMove } from "./types";
import { toCoord, toKey } from "./util";

// Function to test if blockInHand fits into given space on game board
// Need to check if any of the 3 permutations of blockInHand align
export function doesBlockFit( blockInHand: NewBlock, coord: Coordinate, gameBoard: GameBoard ): PlacedBlock | undefined {
  // Only need to check 3 of the permutations based on space on game board
  // If we assume the block at (0,0) has PlacedBlockA orientation, then
  // all (x,y) where x+y is even will be A, and x+y is odd is B
  let testBlocks = permuteBlock(blockInHand);
  //console.log(testBlocks);
  const validPlays = testBlocks.filter( (testBlock)=> {
    let blockFits = false;
    // For a block to fit, it must have an orientation where its edge can align with the target piece
    // AND its other edges must also align with the edges of other peices (when they exist)
    //   If x+y EVEN, then the edges to check would be (x-1, y), (x+1, y), and (x, y-1)
    // AND its opposite corner must also align with the corresponding corner of a piece (when it exists)
    //   If x+y EVEN, then the vertices to check would be
    //                ABOVE: (x-1,y+1), (x,y+1), (x+1,y+1)
    //                DOWN LEFT: (x-2, y), (x-2,y-1), (x-1,y-1)
    //                DOWN RIGHT: (x+2,y), (x+2,y-1), (x+1,y-1)
    if( (coord.x + coord.y) % 2 === 0 && testBlock.orientation === 'up' ) {
      const toLeft = gameBoard.get(toKey({ x: coord.x - 1, y: coord.y})) as PlacedBlockB | undefined;
      const toRight = gameBoard.get(toKey({ x: coord.x + 1, y: coord.y })) as PlacedBlockB | undefined;
      const toBelow = gameBoard.get(toKey({ x: coord.x, y: coord.y - 1})) as PlacedBlockB | undefined;

      const upLeft = gameBoard.get(toKey({ x: coord.x - 1, y: coord.y + 1})) as PlacedBlockA | undefined;
      const upMiddle = gameBoard.get(toKey({ x: coord.x, y: coord.y + 1})) as PlacedBlockB | undefined;
      const upRight = gameBoard.get(toKey({ x: coord.x + 1, y: coord.y + 1})) as PlacedBlockA | undefined;

      const leftUp = gameBoard.get(toKey({ x: coord.x - 2, y: coord.y})) as PlacedBlockA | undefined;
      const leftMiddle = gameBoard.get(toKey({ x: coord.x - 2, y: coord.y - 1})) as PlacedBlockB | undefined;
      const leftDown = gameBoard.get(toKey({ x: coord.x - 1, y: coord.y - 1})) as PlacedBlockA | undefined;

      const rightUp = gameBoard.get(toKey({ x: coord.x + 2, y: coord.y})) as PlacedBlockA | undefined;
      const rightMiddle = gameBoard.get(toKey({ x: coord.x + 2, y: coord.y - 1})) as PlacedBlockB | undefined;
      const rightDown = gameBoard.get(toKey({ x: coord.x + 1, y: coord.y - 1})) as PlacedBlockA | undefined;

      blockFits =
      (toLeft === undefined || (testBlock.bottomLeft === toLeft.bottomCenter && testBlock.topCenter === toLeft.topRight)) &&
      (toRight === undefined || (testBlock.bottomRight === toRight.bottomCenter && testBlock.topCenter === toRight.topLeft)) &&
      (toBelow === undefined || (testBlock.bottomLeft === toBelow.topLeft && testBlock.bottomRight === toBelow.topRight)) &&
      (upLeft === undefined || testBlock.topCenter === upLeft.bottomRight) &&
      (upMiddle === undefined || testBlock.topCenter === upMiddle.bottomCenter) &&
      (upRight === undefined || testBlock.topCenter === upRight.bottomLeft) &&
      (leftUp === undefined || testBlock.bottomLeft === leftUp.bottomRight) &&
      (leftMiddle === undefined || testBlock.bottomLeft === leftMiddle.topRight) &&
      (leftDown == undefined || testBlock.bottomLeft === leftDown.topCenter) &&
      (rightUp === undefined || testBlock.bottomRight === rightUp.bottomLeft) &&
      (rightMiddle === undefined || testBlock.bottomRight === rightMiddle.topLeft) &&
      (rightDown === undefined || testBlock.bottomRight === rightDown.topCenter);
    }
    // For a block to fit, it must have an orientation where its edge can align with the target piece
    // AND its other edges must also align with the edges of other peices (when they exist)
    //   If x+y ODD, then the edges to check would be (x-1, y), (x+1, y), and (x, y+1)
    // AND its opposite corner must also align with the corresponding corner of a piece (when it exists)
    //   If x+y ODD, then the vertices to check would be
    //                BELOW: (x-1, y-1), (x,y-1), (x+1,y-1)
    //                UP LEFT: (x-2,y), (x-2,y+1), (x-1,y+1)
    //                UP RIGHT: (x+1,y+1), (x+2,y+1), (x+2,y)
    else if( Math.abs((coord.x + coord.y)) % 2 === 1 && testBlock.orientation === 'down' ) {
      const toLeft = gameBoard.get(toKey({ x: coord.x - 1, y: coord.y})) as PlacedBlockA | undefined;
      const toRight = gameBoard.get(toKey({ x: coord.x + 1, y: coord.y })) as PlacedBlockA | undefined;
      const toAbove = gameBoard.get(toKey({ x: coord.x, y: coord.y + 1})) as PlacedBlockA | undefined;

      const downLeft = gameBoard.get(toKey({ x: coord.x - 1, y: coord.y - 1})) as PlacedBlockB | undefined;
      const downMiddle = gameBoard.get(toKey({ x: coord.x, y: coord.y - 1})) as PlacedBlockA | undefined;
      const downRight = gameBoard.get(toKey({ x: coord.x + 1, y: coord.y - 1})) as PlacedBlockB | undefined;

      const leftDown = gameBoard.get(toKey({ x: coord.x - 2, y: coord.y})) as PlacedBlockB | undefined;
      const leftMiddle = gameBoard.get(toKey({ x: coord.x - 2, y: coord.y + 1})) as PlacedBlockA | undefined;
      const leftUp = gameBoard.get(toKey({ x: coord.x - 1, y: coord.y + 1})) as PlacedBlockB | undefined;

      const rightUp = gameBoard.get(toKey({ x: coord.x + 1, y: coord.y + 1})) as PlacedBlockB | undefined;
      const rightMiddle = gameBoard.get(toKey({ x: coord.x + 2, y: coord.y + 1})) as PlacedBlockA | undefined;
      const rightDown = gameBoard.get(toKey({ x: coord.x + 2, y: coord.y})) as PlacedBlockB | undefined;

      blockFits =
      (toLeft === undefined || (testBlock.topLeft === toLeft.topCenter && testBlock.bottomCenter === toLeft.bottomRight)) &&
      (toRight === undefined || (testBlock.bottomCenter === toRight.bottomLeft && testBlock.topRight === toRight.topCenter)) &&
      (toAbove === undefined || (testBlock.topLeft === toAbove.bottomLeft && testBlock.topRight === toAbove.bottomRight)) &&
      (downLeft === undefined || testBlock.bottomCenter === downLeft.topRight) &&
      (downMiddle === undefined || testBlock.bottomCenter === downMiddle.topCenter) &&
      (downRight === undefined || testBlock.bottomCenter === downRight.topLeft) &&
      (leftDown === undefined || testBlock.topLeft === leftDown.topRight) &&
      (leftMiddle === undefined || testBlock.topLeft === leftMiddle.bottomRight) &&
      (leftUp == undefined || testBlock.topLeft === leftUp.bottomCenter) &&
      (rightUp === undefined || testBlock.topRight === rightUp.bottomCenter) &&
      (rightMiddle === undefined || testBlock.topRight === rightMiddle.bottomLeft) &&
      (rightDown === undefined || testBlock.topRight === rightDown.topLeft);
    }

    return blockFits;
  });
  return validPlays[0];
}

// For each gameboard entry, look at the 3 coordinate spaces around its 3 edges,
// Then return a list of unique coordinates available, meaning:
// 1) the space is empty
// 2) the space is adjacent to the edge of another already PlacedBlock
export function getAvailableCoords(gameBoard: GameBoard): Coordinate[] {
  const availableKeys = new Set<string>();
  gameBoard.forEach((placedBlock, key) => {
    const coord = toCoord(key);
    const neighbors: Coordinate[] = [];
    if (placedBlock.orientation === 'up') {
      neighbors.push(...[
        { x: coord.x-1, y: coord.y },
        { x: coord.x+1, y: coord.y },
        { x: coord.x, y: coord.y-1 },
      ]);
    } else {
      neighbors.push(...[
        { x: coord.x-1, y: coord.y },
        { x: coord.x+1, y: coord.y },
        { x: coord.x, y: coord.y+1 },
      ]);
    }
    neighbors.forEach(coord => {
      const nkey = toKey(coord);
      // Check if space already filled
      if (!gameBoard.has(nkey)) {
        availableKeys.add(nkey);
      }
    });
  })
  return Array.from(availableKeys.keys()).map(toCoord);
}


// To determine if a blockInHand can be placed, we need to check all gameboard entries
// Then we can loop through those to see if any of the NewBlocks in hand fit
export function searchForMoves( tilesInHand: NewBlock[], gameBoard: GameBoard ) : PotentialMove[] {
  const toReturn: PotentialMove[] = [];
  const availableSpaces = getAvailableCoords(gameBoard);
  tilesInHand.forEach(tile => {
    availableSpaces.forEach(coord => {
      const potentialMove = doesBlockFit(tile, coord, gameBoard);
      if( potentialMove ) {
        toReturn.push( {
          coord: coord,
          newBlock: tile,
          placedBlock: potentialMove,
        });
      }
    });
  });
  return toReturn;
}


  // const potentialMoves: [ PlacedBlock[], Coordinate ] = [];
  // gameBoard.forEach((tilesInHand) => {
