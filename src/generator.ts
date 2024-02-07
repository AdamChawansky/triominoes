// (0,0,0), (0,0,1), ... (0,0,5), (0,1,1), ... (5,5,5)

import { NewBlock, PlacedBlock, Coordinate } from "./types";

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
    topCenter: tile[0],
    bottomLeft: tile[1],
    bottomRight: tile[2],
  }, {
    topCenter: tile[1],
    bottomLeft: tile[2],
    bottomRight: tile[0],
  }, {
    topCenter: tile[2],
    bottomLeft: tile[0],
    bottomRight: tile[1],
  }, {
  // Make the 3 B types
    bottomCenter: tile[0],
    topLeft: tile[1],
    topRight: tile[2],
  }, {
    bottomCenter: tile[1],
    topLeft: tile[2],
    topRight: tile[0],
  }, {
    bottomCenter: tile[2],
    topLeft: tile[0],
    topRight: tile[1],
  }];
}

// Write a function that defines array of playspace
// How to expand from the "center" of the board?
// Or just allocate a fuckton of space and hope it's enough?
// Or allocate a reasonable amount of space and recopy into an array with double dimensions if you ever hit the boundaries?
// Treat it as a hash table with (0,0) as the origin. Keys are (x,y) 
const gameBoard = new Map<string, PlacedBlock>();
gameBoard.set("0,0", {
  bottomCenter: 2,
  topLeft: 0,
  topRight: 1,
});
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

// Write a function that given a new Block and placedBlock, do they align?
function doBlocksAlign( testBlock: NewBlock, ): PlacedBlock|Boolean {
  for( let i=0; i<)
    if () {
      return PlacedBlock;
  }
   return false;
}