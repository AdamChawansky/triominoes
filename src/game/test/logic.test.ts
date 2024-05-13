import { describe, expect, test } from "vitest";
import { GameBoard, NewTile } from "../types";
import { doesTileFit, getAvailableCoords, searchForMove } from "../logic";
import { genNewTile } from "../generator";

describe('logic test 1', () => {
  test('getAvailableCoords', () => {
    const gameBoard: GameBoard = new Map();

    gameBoard.set("0,0", {
      orientation: 'up',
      newTileID: "0,1,2",
      topCenter: 0,
      bottomRight: 1,
      bottomLeft: 2,
    });
    gameBoard.set("1,-1", {
      orientation: 'up',
      newTileID: "0,1,2",
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
    newTileID: "0,1,2",
    topCenter: 0,
    bottomRight: 1,
    bottomLeft: 2,
    });
    
    const hand: NewTile[] = ([
      [1,2,2],
      [0,0,0],
      [0,0,1],
      [0,2,5],
    ] satisfies [number, number, number][]).map(genNewTile);

    expect(doesTileFit(hand[0], {x: 0, y:-1}, gameBoard)).toBeTruthy();
    expect(doesTileFit(hand[1], {x: 5, y:5}, gameBoard)).toBeTruthy();
    expect(doesTileFit(hand[2], {x: 1, y:0}, gameBoard)).toBeTruthy();
    expect(doesTileFit(hand[3], {x:-1, y:0}, gameBoard)).toBeTruthy();
  });
});


describe('logic test 3', () => {
  test('searchForMove', () => {
    const gameBoard: GameBoard = new Map();

    gameBoard.set("0,0", {
      orientation: 'up',
      newTileID: "0,1,2",
      topCenter: 0,
      bottomRight: 1,
      bottomLeft: 2,
    });
  
    const hand: NewTile[] = ([
      [1,2,2],
      [0,0,0],
      [0,0,1],
      [0,2,5],
    ] satisfies [number, number, number][]).map(genNewTile);
  
    expect(searchForMove(hand[0], gameBoard).length).toBe(1);
    expect(searchForMove(hand[1], gameBoard).length).toBe(0);
    expect(searchForMove(hand[2], gameBoard).length).toBe(1);
    expect(searchForMove(hand[3], gameBoard).length).toBe(1);
  });
});