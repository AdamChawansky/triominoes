import { NewBlock, PlacedBlock, PlacedBlockA, PlacedBlockB, Coordinate } from "./types";
import { makeNewBlocks, doesBlockFit, TestBlockPlacer } from "./generator";

function TestGenerator() {
  const newBlocks = makeNewBlocks();
  console.log(newBlocks);
}

function TestBlockPlacer() {
  type GameBoard = Map<string, PlacedBlock>;
  const gameBoard: GameBoard = new Map();
  
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

//TestGenerator();
//TestBlockPlacer();