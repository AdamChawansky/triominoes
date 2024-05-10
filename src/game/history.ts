import { permuteBlock } from "./generator";
import { MAX_DRAW, determineFirstPlay, pointsFromPlay } from "./logic";
import { GameBoard, GameHistory, GameState, NewBlock } from "./types";
import { toKey } from "./util";

export function replayHistory(gameHistory: GameHistory): GameState {
  const gameBoard: GameBoard = new Map();
  const hands: NewBlock[][] = [[]];
  const scores: number[] = [];

  const gameState: GameState = {
    gameBoard: gameBoard,
    hands: hands,
    scores: scores,
    drawPile: [...gameHistory.startingDeck],
    gameLog: [],
    activePlayer: 0,
    tilesDrawnThisTurn: 0,
    lastPlay: {x: 0, y: 0},
  };

  let gameStarted = false; // flag used to avoid subtracting points for drawing starting tiles

  gameHistory.actions.forEach((action) => {
    if(action.actionType === 'play') {
      gameState.gameBoard.set(toKey(action.coord), action.tilePlayed);

      const index = gameState.hands[action.playerIndex].findIndex(tile => tile.id === action.tilePlayed.newBlockID);
      gameState.hands[action.playerIndex].splice(index, 1);

      const pointsForTurn = pointsFromPlay(action.tilePlayed, action.coord, gameState.gameBoard);
      gameState.scores[action.playerIndex] += pointsForTurn;

      gameState.lastPlay = action.coord;

      gameState.gameLog.push(`Player ${action.playerIndex+1} plays the [${action.tilePlayed.newBlockID}] at (${toKey(action.coord)}) for ${pointsForTurn} points.`);
      gameState.activePlayer = (action.playerIndex + 1) % gameState.hands.length; // next player's turn
      gameState.tilesDrawnThisTurn = 0; // reset tiles drawn counter after a play is made
    } else if(action.actionType === 'draw') {
      if (!gameStarted) {
        // don't subtract points for drawing initial hand & don't log it
        gameState.hands[action.playerIndex].push(gameState.drawPile.pop()!);
      } else {
        if(gameState.drawPile.length > 0) {
          gameState.hands[action.playerIndex].push(gameState.drawPile.pop()!);
          gameState.tilesDrawnThisTurn += 1;
          gameState.scores[action.playerIndex] -= 5;
          gameState.gameLog.push(`Player ${action.playerIndex+1} draws a tile and loses 5 points.`);

          // QUESTION FOR PAUL: At this point, tilesDrawnThisTurn could = MAX_DRAW. But we don't know if the player can make a play or
          // will end up passing until we look at the next action.
        } else {
          gameState.scores[action.playerIndex] -= 10;
          gameState.gameLog.push(`Player ${action.playerIndex+1} can not play or draw and loses 10 points.`);

          gameState.activePlayer = (gameState.activePlayer + 1) % gameState.hands.length; // next player's turn
          gameState.tilesDrawnThisTurn = 0;
        }
      }
    } else if(action.actionType === 'init') {
      const firstPlay: [number, number] = determineFirstPlay(gameState);
      const playerIndex = firstPlay[0];
      const tileIndex = firstPlay[1];
      const tilePlayed = gameState.hands[playerIndex][firstPlay[1]];

      gameState.gameBoard.set("0,0", permuteBlock(tilePlayed)[0]);

      gameState.hands[playerIndex].splice(tileIndex, 1);

      let pointsForTurn = tilePlayed.numbers.reduce((acc, value) => acc + value, 0);
      if (pointsForTurn === 0) {
        pointsForTurn += 30; // 30 points for starting with (0,0,0)
      } else if (tilePlayed.numbers[0] === tilePlayed.numbers[1] && tilePlayed.numbers[1] === tilePlayed.numbers[2]) {
        pointsForTurn += 10; // 10 bonus points for starting with a triple
      }
      gameState.scores[playerIndex] = pointsForTurn;

      gameState.lastPlay = {x:0, y:0};
      
      gameState.gameLog.push(`All players draw starting tiles.`);
      gameState.gameLog.push(`Player ${playerIndex+1} plays the [${tilePlayed.id}] at (0,0) for ${pointsForTurn} points.`);

      gameState.activePlayer = (playerIndex + 1) % gameState.hands.length;

      gameStarted = true;
    } else if(action.actionType === 'end') {
      const winner: number = gameState.scores.indexOf(Math.max(...gameState.scores));
      gameState.gameLog.push(`Game over. Player ${winner+1} wins!`)
    }
    else {
      console.log("Not a valid action.");
    }
  });

  return gameState;
}