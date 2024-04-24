import { permuteBlock } from "./generator";
import { pointsFromPlay } from "./logic";
import { GameBoard, GameHistory, GameState, NewBlock } from "./types";
import { toKey } from "./util";

export function simulateHistory(gameHistory: GameHistory): GameState {
  const gameBoard: GameBoard = new Map();
  const hands: NewBlock[][] = [[]];
  const scores: number[] = [];

  const gameState: GameState = {
    gameBoard: gameBoard,
    hands: hands,
    scores: scores,
    drawPile: [...gameHistory.startingDeck],
    gameLog: [],
    lastPlay: {x: 0, y: 0},
  };

  gameHistory.actions.forEach((action) => {
    if(action.actionType === 'play') {
      gameState.gameBoard.set(toKey(action.coord), action.tilePlayed);

      const index = gameState.hands[action.playerIndex].findIndex(tile => tile.id === action.tilePlayed.newBlockID);
      gameState.hands[action.playerIndex].splice(index, 1);

      const pointsForTurn = pointsFromPlay(action.tilePlayed, action.coord, gameState.gameBoard);
      gameState.scores[action.playerIndex] += pointsForTurn;

      gameState.lastPlay = action.coord;

      gameState.gameLog.push(`Player ${action.playerIndex} plays the ${action.tilePlayed.newBlockID} at ${toKey(action.coord)} for ${pointsForTurn} points.`);
    } else if(action.actionType === 'draw') {
      if(gameState.drawPile.length > 0) {
        gameState.hands[action.playerIndex].push(gameState.drawPile.pop()!);
        gameState.scores[action.playerIndex] -= 5;
        gameState.gameLog.push(`Player ${action.playerIndex} draws a tile and loses 5 points.`);
      } else {
        gameState.scores[action.playerIndex] -= 10;
        gameState.gameLog.push(`Player ${action.playerIndex} can not play or draw and loses 10 points.`);
      }
    } else if(action.actionType === 'init') {
      // Choose a random tile to be the starting tile
      const temp = permuteBlock( gameState.drawPile.pop()! );
      gameState.gameBoard.set( "0,0", temp[0] );
    } else {
      console.log("Not a valid action.");
    }
  });

  return gameState;
}


// HOMEWORK FOR ADAM 2
// Write helper function that takes GameHistory and makes the first 10 moves.
// Make action, add to history, call simulateGame
// Have to derive history each new play

// HOMEWORK FOR ADAM 3
// Instead of updating the state, return either Draw or Play action and add to history
