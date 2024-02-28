// (0,0,0), (0,0,1), ... (0,0,5), (0,1,1), ... (5,5,5)

import { NewBlock, PlacedBlock, PlacedBlockA, PlacedBlockB, Coordinate } from "./types";

// Treat game board  as a hash table with (0,0) as the origin. Keys are (x,y) coordinates.
type GameBoard = Map<string, PlacedBlock>;
const gameBoard: GameBoard = new Map();

/*
https://en.wikipedia.org/wiki/Triominoes
gameBoard.has("0,0");
gameBoard.get("0,0");
gameBoard.keys();
gameBoard.values();
gameBoard.entries();
*/

const hands: NewBlock[][] = [];
const drawPile = makeNewBlocks();

// Starting tiles depends on number of players
//    2 players start with 9 tiles each
//    3-4 players start with 7 tiles each
//    5-6 players start with 6 tiles each
const NUM_PLAYERS: number = 1;
let NUM_STARTING_TILES: number = 1;
if( NUM_PLAYERS === 1 || NUM_PLAYERS === 2 ) {
  NUM_STARTING_TILES = 9;
} else if( NUM_PLAYERS === 3 || NUM_PLAYERS === 4 ) {
  NUM_STARTING_TILES = 7;
} else if( NUM_PLAYERS === 5 || NUM_PLAYERS === 6 ) {
  NUM_STARTING_TILES = 6;
}
for(let i = 0; i < NUM_PLAYERS; i++) {
  for(let i = 0; i < NUM_STARTING_TILES; i++) {
    hands[i].push( drawPile.pop()! );
  }
}

// Choose a random tile to be the starting tile
const temp = permuteBlock( drawPile.pop()! );
function determineFirstPlay( hands: NewBlock[], gameBoard: GameBoard ): undefined {
  // FOR LATER: Introduce logic to look through all hands for the "proper" first tile
  //            (5,5,5) --> (4,4,4) --> (3,3,3) --> (2,2,2) --> (1,1,1) --> (0,0,0) --> highest sum
  gameBoard.set( "0,0", temp[0] );
  return;
}

export function makeNewBlocks(): NewBlock[] {
  const newBlocks: NewBlock[] = [];

  // Make all of the possible triominoes from (0,0,0) to (5,5,5)
  for(let i = 0; i <= 5; i++) {
    for(let j = i; j <= 5; j++) {
      for(let k = j; k <=5 ; k++) {
        newBlocks.push({
          id: [i,j,k].join(","), 
          numbers: [i,j,k],
        });
      }
    }
  }

  // Shuffle the tiles
  for(let i=0; i<newBlocks.length; i++) {
    // Pick a random number between 0 and # of newBlocks
    let shuffle = Math.floor(Math.random() * (newBlocks.length));
    
    // Swap the current with a random position
    [ newBlocks[i], newBlocks[shuffle] ] = [ newBlocks[shuffle], newBlocks[i] ];
  }

  return newBlocks;
}

// Given a NewBlock, return 3 permutations of As and Bs
function permuteBlock( tile:NewBlock ): PlacedBlock[] {
  return [{
  // Make the 3 A types
    orientation: 'up',
    newBlockID: tile.id,
    topCenter: tile.numbers[0],
    bottomRight: tile.numbers[1],
    bottomLeft: tile.numbers[2],
  }, {
    orientation: 'up',
    newBlockID: tile.id,
    topCenter: tile.numbers[1],
    bottomRight: tile.numbers[2],
    bottomLeft: tile.numbers[0],
  }, {
    orientation: 'up',
    newBlockID: tile.id,
    topCenter: tile.numbers[2],
    bottomRight: tile.numbers[0],
    bottomLeft: tile.numbers[1],
  }, {
  // Make the 3 B types
    orientation: 'down',
    newBlockID: tile.id,
    bottomCenter: tile.numbers[0],
    topLeft: tile.numbers[1],
    topRight: tile.numbers[2],
  }, {
    orientation: 'down',
    newBlockID: tile.id,
    bottomCenter: tile.numbers[1],
    topLeft: tile.numbers[2],
    topRight: tile.numbers[0],
  }, {
    orientation: 'down',
    newBlockID: tile.id,
    bottomCenter: tile.numbers[2],
    topLeft: tile.numbers[0],
    topRight: tile.numbers[1],
  }];
}

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


// To determine if a blockInHand can be placed, we need to check all gameboard entries
// For each gameboard entry, look at the 3 coordinate spaces around its 3 edges
// Create an array of all possible moves to select from, then choose one
function searchForMoves( tilesInHand: NewBlock[], gameBoard: GameBoard ) : Coordinate[] {
  // const potentialMoves: [ PlacedBlock[], Coordinate ] = [];
  // gameBoard.forEach((tilesInHand) => {

  //   return;
  // });
  return [];
}

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