// (0,0,0), (0,0,1), ... (0,0,5), (0,1,1), ... (5,5,5)

import { NewBlock, PlacedBlock } from "./types";

export function genNewBlock(nums: [number, number, number]): NewBlock {
  return {
    id: nums.join(","), 
    numbers: nums,
  };
}

export function makeNewBlocks(): NewBlock[] {
  const newBlocks: NewBlock[] = [];

  // Make all of the possible triominoes from (0,0,0) to (5,5,5)
  for(let i = 0; i <= 5; i++) {
    for(let j = i; j <= 5; j++) {
      for(let k = j; k <=5 ; k++) {
        newBlocks.push( genNewBlock([i,j,k]) );
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
export function permuteBlock( tile:NewBlock ): PlacedBlock[] {
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
