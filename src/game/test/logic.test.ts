import { describe, expect, test } from "vitest";
import { GameBoard, NewBlock } from "../types";
import { doesBlockFit, getAvailableCoords, searchForMove } from "../logic";
import { genNewBlock } from "../generator";

describe('logic test 1', () => {
  test('getAvailableCoords', () => {
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

    expect(getAvailableCoords(gameBoard).length).toBe(5);
  });
});


describe('logic test 2', () => {
  test('doesBlockFit', () => {
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

    expect(doesBlockFit(hand[0], {x: 0, y:-1}, gameBoard)).toBeTruthy();
    expect(doesBlockFit(hand[1], {x: 5, y:5}, gameBoard)).toBeFalsy();
    expect(doesBlockFit(hand[2], {x: 1, y:0}, gameBoard)).toBeTruthy();
    expect(doesBlockFit(hand[3], {x:-1, y:0}, gameBoard)).toBeFalsy();
  });
});


describe('logic test 3', () => {
  test('searchForMove', () => {
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
  
    expect(searchForMove(hand[0], gameBoard).length).toBe(1);
    expect(searchForMove(hand[1], gameBoard).length).toBe(0);
    expect(searchForMove(hand[2], gameBoard).length).toBe(1);
    expect(searchForMove(hand[3], gameBoard).length).toBe(0);
  });
});