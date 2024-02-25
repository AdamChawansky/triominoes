import { NewBlock, PlacedBlock, PlacedBlockA, PlacedBlockB, Coordinate } from "./types";
import { makeNewBlocks, doesBlockFit, TestBlockPlacer } from "./generator";

function TestGenerator() {
  const newBlocks = makeNewBlocks();
  console.log(newBlocks);
}

//TestGenerator();
//TestBlockPlacer();