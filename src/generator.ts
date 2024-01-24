// (0,0,0), (0,0,1), ... (0,0,5), (0,1,1), ... (5,5,5)

import { NewBlock } from "./types";

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