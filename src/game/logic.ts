import { permuteBlock } from "./generator";
import { MAX_DRAW } from "./main";
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
// FOR LATER: refactor this function to take a single tile rather than an array
export function searchForMoves( tilesInHand: NewBlock[], gameBoard: GameBoard ): PotentialMove[] {
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


export function takeTurn( tilesInHand: NewBlock[], drawPile: NewBlock[], gameBoard: GameBoard ): number {
  let potentialMoves: PotentialMove[] = searchForMoves( tilesInHand, gameBoard );
  let pointsForTurn: number = 0;
  // FOR LATER: Create heuristics to decide which move to prioritize
  // FOR LATER: Implement machine learning to determine best move
  
  if( potentialMoves.length > 0 ) {
    let index = tilesInHand.findIndex(tile => tile.id === potentialMoves[0].newBlock.id);
    tilesInHand.splice(index, 1);
    gameBoard.set( toKey(potentialMoves[0].coord), potentialMoves[0].placedBlock );
    return pointsForTurn;
  } else {
    // If no move exists for all tiles in hand, then draw (up to MAX_DRAW) new tiles
    // Check whether each new tile can be played before drawing another
    let newTiles: NewBlock[] = [];
    for( let i = 0; i < MAX_DRAW; i++ ) {
      if( drawPile.length > 0 ) {
        console.log("I drew tile", i+1);
        newTiles.push( drawPile.pop()! );
        potentialMoves = searchForMoves( [newTiles[i]], gameBoard );
        if( potentialMoves.length > 0 ) {
          // Play that tile
          let index = newTiles.findIndex(tile => tile.id === potentialMoves[0].newBlock.id);
          newTiles.splice(index, 1);
          gameBoard.set( toKey(potentialMoves[0].coord), potentialMoves[0].placedBlock );
          tilesInHand = tilesInHand.concat(newTiles);
          return pointsForTurn;
        }
      }
    }
  }
  return -5 * MAX_DRAW;
}


// Function to determine points from placing a tile
export function pointsFromPlay( placedBlock: PlacedBlock, coord: Coordinate, gameBoard: GameBoard ): number {
  let points: number = placedBlock.newBlockID.split(',').map(Number).reduce((sum, num) => sum + num, 0);
  
  // Determine if placedBlock completes one of 3 possible hexagons (50 points per hexagon)
  // Need to check coordinates of hexagon formed around the 3 vertices of placedBlock
  if( placedBlock.orientation === 'up' ) {
    // Check Up: (x-1,y), (x+1,y), (x-1,y+1), (x,y+1), (x+1,y+1)
    // Check DownLeft: (x-2,y), (x-1,y), (x-2,y-1), (x-1,y-1), (x,y-1)
    // Check DownRight: (x+1,y), (x+2,y), (x,y-1), (x+1,y-1), (x-1,y+1)
    const hexAbove: Boolean =
      gameBoard.has(toKey({ x: coord.x-1, y: coord.y})) &&
      gameBoard.has(toKey({ x: coord.x+1, y: coord.y})) &&
      gameBoard.has(toKey({ x: coord.x-1, y: coord.y+1})) &&
      gameBoard.has(toKey({ x: coord.x,   y: coord.y+1})) &&
      gameBoard.has(toKey({ x: coord.x+1, y: coord.y+1}));
    const hexDownLeft: Boolean =
      gameBoard.has(toKey({ x: coord.x-2, y: coord.y})) &&
      gameBoard.has(toKey({ x: coord.x-1, y: coord.y})) &&
      gameBoard.has(toKey({ x: coord.x-2, y: coord.y-1})) &&
      gameBoard.has(toKey({ x: coord.x-1, y: coord.y-1})) &&
      gameBoard.has(toKey({ x: coord.x,   y: coord.y-1}));
    const hexDownRight: Boolean =
      gameBoard.has(toKey({ x: coord.x+1, y: coord.y})) &&
      gameBoard.has(toKey({ x: coord.x+2, y: coord.y})) &&
      gameBoard.has(toKey({ x: coord.x,   y: coord.y-1})) &&
      gameBoard.has(toKey({ x: coord.x+1, y: coord.y-1})) &&
      gameBoard.has(toKey({ x: coord.x-1, y: coord.y+1}));
    if( hexAbove ) points += 50;
    if( hexDownLeft ) points += 50;
    if( hexDownRight ) points += 50;
  } else {
    // Check Down: (x-1,y), (x+1,y), (x-1,y-1), (x,y-1), (x+1,y-1)
    // Check UpLeft: (x-2,y), (x-1,y), (x-2,y+1), (x-1,y+1), (x,y+1)
    // Check UpRight: (x+1,y), (x+2,y), (x,y+1), (x+1,y+1), (x+2,y+1)
    const hexBelow: Boolean =
      gameBoard.has(toKey({ x: coord.x-1, y: coord.y})) &&
      gameBoard.has(toKey({ x: coord.x+1, y: coord.y})) &&
      gameBoard.has(toKey({ x: coord.x-1, y: coord.y-1})) &&
      gameBoard.has(toKey({ x: coord.x,   y: coord.y-1})) &&
      gameBoard.has(toKey({ x: coord.x+1, y: coord.y-1}));
    const hexUpLeft: Boolean =
      gameBoard.has(toKey({ x: coord.x-2, y: coord.y})) &&
      gameBoard.has(toKey({ x: coord.x-1, y: coord.y})) &&
      gameBoard.has(toKey({ x: coord.x-2, y: coord.y+1})) &&
      gameBoard.has(toKey({ x: coord.x-1, y: coord.y+1})) &&
      gameBoard.has(toKey({ x: coord.x,   y: coord.y+1}));
    const hexUpRight: Boolean =
      gameBoard.has(toKey({ x: coord.x+1, y: coord.y})) &&
      gameBoard.has(toKey({ x: coord.x+2, y: coord.y})) &&
      gameBoard.has(toKey({ x: coord.x,   y: coord.y+1})) &&
      gameBoard.has(toKey({ x: coord.x+1, y: coord.y+1})) &&
      gameBoard.has(toKey({ x: coord.x+2, y: coord.y+1}));
    if( hexBelow ) points += 50;
    if( hexUpLeft ) points += 50;
    if( hexUpRight ) points += 50;
  }

  // Determine if placedBlock completes a bridge (40 points per bridge)
  // Assuming all previous moves were legal, you only need to check
  // if matching one edge of a placedBlock with the point DIRECTLY OPPOSITE
  // (There seem to be other definitions of a bridge, but this is my interpretation.)
  if( placedBlock.orientation === 'up' ) {
    // Check Above: (x,y-1) & (x,y+1)
    // Check DownLeft: (x+1,y) & (x-2,y-1)
    // Check DownRight: (x-1,y) & (x+2,y-1)
    const bridgeAbove: Boolean =
      gameBoard.has(toKey({ x: coord.x, y: coord.y-1})) &&
      gameBoard.has(toKey({ x: coord.x, y: coord.y+1}));
    const bridgeDownLeft: Boolean =
      gameBoard.has(toKey({ x: coord.x+1, y: coord.y})) &&
      gameBoard.has(toKey({ x: coord.x-2, y: coord.y-1}));
    const bridgeDownRight: Boolean =
      gameBoard.has(toKey({ x: coord.x-1, y: coord.y})) &&
      gameBoard.has(toKey({ x: coord.x+2, y: coord.y-1}));
    if( bridgeAbove ) points += 40;
    if( bridgeDownLeft ) points += 40;
    if( bridgeDownRight ) points += 40;
  } else {
    // Check Below: (x,y+1) & (x,y-1)
    // Check UpLeft: (x+1,y) & (x-2,y+1)
    // Check UpRight: (x-1,y) & (x+2,y+1)
    const bridgeBelow: Boolean =
      gameBoard.has(toKey({ x: coord.x, y: coord.y})) &&
      gameBoard.has(toKey({ x: coord.x, y: coord.y}));
    const bridgeUpLeft: Boolean =
      gameBoard.has(toKey({ x: coord.x, y: coord.y})) &&
      gameBoard.has(toKey({ x: coord.x, y: coord.y}));
    const bridgeUpRight: Boolean =
      gameBoard.has(toKey({ x: coord.x, y: coord.y})) &&
      gameBoard.has(toKey({ x: coord.x, y: coord.y}));
    if( bridgeBelow ) points += 40;
    if( bridgeUpLeft ) points += 40;
    if( bridgeUpRight ) points += 40;
  }

  return points;
}