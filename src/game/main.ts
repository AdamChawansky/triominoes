// (0,0,0), (0,0,1), ... (0,0,5), (0,1,1), ... (5,5,5)

import { makeNewBlocks, permuteBlock } from "./generator";
import { takeTurn } from "./logic";
import { NewBlock, PlacedBlock } from "./types";

// Treat game board  as a hash table with (0,0) as the origin. Keys are (x,y) coordinates.
type GameBoard = Map<string, PlacedBlock>;
export const NUM_PLAYERS: number = 1;
export let NUM_STARTING_TILES: number = 1;
export const MAX_DRAW = 3;

export function simulateGame(): GameBoard {
  const gameBoard: GameBoard = new Map();

  /*
  https://en.wikipedia.org/wiki/Triominoes
  gameBoard.has("0,0");
  gameBoard.get("0,0");
  gameBoard.keys();
  gameBoard.values();
  gameBoard.entries();
  */

  const hands: NewBlock[][] = [[]];
  const scores: number[] = [];
  const drawPile = makeNewBlocks();

  // Starting tiles depends on number of players
  //    2 players start with 9 tiles each
  //    3-4 players start with 7 tiles each
  //    5-6 players start with 6 tiles each
  if( NUM_PLAYERS === 1 || NUM_PLAYERS === 2 ) {
    NUM_STARTING_TILES = 9;
  } else if( NUM_PLAYERS === 3 || NUM_PLAYERS === 4 ) {
    NUM_STARTING_TILES = 7;
  } else if( NUM_PLAYERS === 5 || NUM_PLAYERS === 6 ) {
    NUM_STARTING_TILES = 6;
  }
  for(let i = 0; i < NUM_PLAYERS; i++) {
    hands[i] = [];
    scores[i] = 0;
    for(let j = 0; j < NUM_STARTING_TILES; j++) {
      hands[i].push( drawPile.pop()! );
    }
  }

  // function determineFirstPlay( hands: NewBlock[][], gameBoard: GameBoard ): undefined {
  //   // FOR LATER: Introduce logic to look through all hands for the "proper" first tile
  //   //            (5,5,5) --> (4,4,4) --> (3,3,3) --> (2,2,2) --> (1,1,1) --> (0,0,0) --> highest sum
  //                 First player earns 10 bonus points if they play a triple, 40 points for playing (0,0,0)
  //   gameBoard.set( "0,0", temp[0] );
  //   return;
  // }

  // Choose a random tile to be the starting tile
  const temp = permuteBlock( drawPile.pop()! );
  gameBoard.set( "0,0", temp[0] );

  // determineFirstPlay( hands, gameBoard );
  let turns = 0;
  while( hands[0].length > 0 && turns < 200) {
    let pointsForTurn = takeTurn( hands[0], drawPile, gameBoard );
    scores[0] += pointsForTurn;
    console.log(pointsForTurn, scores[0]);
    turns++;

    // End states:
    // 1) A player plays their last tile (any hand[i] === 0)
    //    That player earns 25 points + the total points of everyone else's tiles
    // 2) The drawPile is empty and all players pass, meaning no more moves possible.
    //    Each player loses points equal to sum of their own tiles
  }
  console.log( gameBoard );

  return gameBoard;
}

//    FOR LATER: Keep track of score
//    FOR LATER: Design GUI
//    FOR LATER: Add ability to play versus computer
//    FOR LATER: Add ability to play versus another human (like Paul's Avalon site)