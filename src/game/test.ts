import { NewBlock, GameBoard } from "./types";
import { makeNewBlocks, genNewBlock } from "./generator";
import { doesBlockFit, getAvailableCoords, searchForMoves } from "./logic";

export function TestGenerator() {
  const newBlocks = makeNewBlocks();
  console.log(newBlocks);
}

export function TestBlockPlacer() {
  const gameBoard: GameBoard = new Map();

  gameBoard.set("0,0", {
    orientation: 'up',
    newBlockID: "0,1,2",
    topCenter: 0,
    bottomRight: 1,
    bottomLeft: 2,
  });
  
  const hand: NewBlock[] = ([
    [1,2,2],
    [0,0,0],
    [0,0,1],
    [0,2,5],
  ] satisfies [number, number, number][]).map(genNewBlock);
  console.log("Next test:");
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


export function TestAvailableSpaces() {
  const gameBoard: GameBoard = new Map();

  gameBoard.set("0,0", {
    orientation: 'up',
    newBlockID: "0,1,2",
    topCenter: 0,
    bottomRight: 1,
    bottomLeft: 2,
  });
  gameBoard.set("1,-1", {
    orientation: 'up',
    newBlockID: "0,1,2",
    topCenter: 0,
    bottomRight: 1,
    bottomLeft: 2,
  });

  console.log(getAvailableCoords(gameBoard));
}

export function TestMoveFinder() {
  const gameBoard: GameBoard = new Map();

  gameBoard.set("0,0", {
    orientation: 'up',
    newBlockID: "0,1,2",
    topCenter: 0,
    bottomRight: 1,
    bottomLeft: 2,
  });

  const hand: NewBlock[] = ([
    [1,2,2],
    [0,0,0],
    [0,0,1],
    [0,2,5],
  ] satisfies [number, number, number][]).map(genNewBlock);

  console.log(searchForMoves(hand, gameBoard));
}



// JEST tutorial
// Testing libraries
// Given this board & this block, I expect _______