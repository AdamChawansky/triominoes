// (0,0,0), (0,0,1), ... (0,0,5), (0,1,1), ... (5,5,5)

import { NewBlock, PlacedBlock, PlacedBlockA, PlacedBlockB, Coordinate } from "./types";

export function makeNewBlocks(): NewBlock[] {
  const newBlocks: NewBlock[] = [];
  for(let i=0; i<=5; i++) {
    for(let j=i; j<=5; j++) {
      for(let k=j; k<=5; k++) {
        newBlocks.push([i,j,k]);
      }
    }
  }
  return newBlocks;
}

// Given a NewBlock, return 3 permutations of As and Bs
function permuteBlock( tile:NewBlock ): PlacedBlock[] {
  return [{
  // Make the 3 A types
    orientation: 'up',  
    topCenter: tile[0],
    bottomRight: tile[1],
    bottomLeft: tile[2],
  }, {
    orientation: 'up',
    topCenter: tile[1],
    bottomRight: tile[2],
    bottomLeft: tile[0],
  }, {
    orientation: 'up',
    topCenter: tile[2],
    bottomRight: tile[0],
    bottomLeft: tile[1],
  }, {
  // Make the 3 B types
    orientation: 'down',
    bottomCenter: tile[0],
    topLeft: tile[1],
    topRight: tile[2],
  }, {
    orientation: 'down',
    bottomCenter: tile[1],
    topLeft: tile[2],
    topRight: tile[0],
  }, {
    orientation: 'down',
    bottomCenter: tile[2],
    topLeft: tile[0],
    topRight: tile[1],
  }];
}

// Treat game board  as a hash table with (0,0) as the origin. Keys are (x,y) coordinates.
type GameBoard = Map<string, PlacedBlock>;
const gameBoard: GameBoard = new Map();
//console.log("GameBoard", gameBoard);

/*
gameBoard.has("0,0");
gameBoard.get("0,0");
gameBoard.keys();
gameBoard.values();
gameBoard.entries();
*/

// Function to turn coordinates into keys
function toKey( coord: Coordinate): string {
  return `${coord.x},${coord.y}`;
}
// Function to turn keys into coordinates
function toCoord( key: string ): Coordinate {
  const temp = key.split(',');
  return {
    x: Number(temp[0]),
    y: Number(temp[1]),
  };
}

// Function to test if blockInHand fits into given space on game board
// Need to check if any of the 3 permutations of blockInHand align
// PAUL: This function will correctly say a block fits if it has no other blocks touching. However, that shouldn't
// be possible, because we will only call this function when crawling the board, and so we'll always be testing positions
// that are adjacent to at least one block. But should I add some logic to make sure that the block we are testing
// WOULD BE edge-to-edge will at least one pre-existing block? 
export function doesBlockFit( blockInHand: NewBlock, coord: Coordinate, gameBoard: GameBoard ): PlacedBlock | undefined {
  // Check if space already filled
  if( gameBoard.has(toKey(coord)) ) return;

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

      //console.log("BlockFits (L,R,B): ", toLeft, toRight, toBelow);
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

      //console.log("BlockFits (L,R,A): ", toLeft, toRight, toAbove);
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



export function TestBlockPlacer() {
  gameBoard.set("0,0", {
    orientation: 'up',
    topCenter: 0,
    bottomRight: 1,
    bottomLeft: 2,
  });
  
  const hand: NewBlock[] = [[1,2,2], [0,0,0], [0,0,1], [0,2,5]];
  hand.forEach((blockInHand) => {
    console.log( "Checking blockInHand: ", doesBlockFit(blockInHand, {x: 0, y:-1}, gameBoard) );
  });
  console.log("Next test:");

  hand.forEach((blockInHand) => {
    console.log( "Checking blockInHand: ", doesBlockFit(blockInHand, {x: 5, y:5}, gameBoard) );
  });

  console.log("Next test:");
  hand.forEach((blockInHand) => {
    console.log( "Checking blockInHand: ", doesBlockFit(blockInHand, {x: 1, y:0}, gameBoard) );
  });

  console.log("Next test:");
  hand.forEach((blockInHand) => {
    console.log( "Checking blockInHand: ", doesBlockFit(blockInHand, {x: -1, y:0}, gameBoard) );
  });
}




// To determine if a blockInHand can be placed, we need to check all gameboard entries
// For each gameboard entry, look at the 3 coordinate spaces around its 3 edges
// Create an array of all possible moves to select from, then choose one
/*
function searchForMoves( ) {
  gameBoard.forEach((coord: Coordinate) => {
    return;
  });
}
*/
function placeBlock( placedBlock: PlacedBlock, coord: Coordinate, gameBoard: GameBoard ) {
  gameBoard.set( toKey(coord), placedBlock );
}


//    FOR LATER: Create heuristics to decide which move to prioritize
//    FOR LATER: Implement machine learning to determine best move
// If no move exists for all tiles in hand, then draw (up to 5) new tiles
// Check whether each new tile can be played before drawing another
//    FOR LATER: Keep track of score
//    FOR LATER: Design GUI
//    FOR LATER: Add ability to play versus computer
//    FOR LATER: Add ability to play versus another human (like Paul's Avalon site)





