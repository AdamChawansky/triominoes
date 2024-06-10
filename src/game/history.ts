import { permuteTile } from "./generator";
import { determineFirstPlay, pointsFromPlay } from "./logic";
import { GameBoard, GameHistory, GameState, NewTile } from "./types";
import { toKey } from "./util";

export function replayHistory(gameHistory: GameHistory): GameState {
  const gameBoard: GameBoard = new Map();
  const hands: NewTile[][] = [];
  const scores: number[] = [];

  const gameState: GameState = {
    gameBoard: gameBoard,
    playerNames: [],
    hands: hands,
    scores: scores,
    drawPile: [...gameHistory.startingDeck],
    gameLog: [],
    activePlayer: 0,
    tilesDrawnThisTurn: 0,
    consecutivePasses: 0,
    lastPlay: {x: 0, y: 0},
  };

  let gameStarted = false; // flag used to avoid subtracting points for drawing starting tiles

  gameHistory.actions.forEach((action) => {
    if(action.actionType === 'add-player') {
      gameState.playerNames.push(action.playerName);
      gameState.hands.push([]);
      gameState.scores.push(0);
    } else if(action.actionType === 'play') {
      gameState.gameBoard.set(toKey(action.coord), action.tilePlayed);

      const index = gameState.hands[action.playerIndex].findIndex(tile => tile.id === action.tilePlayed.newTileID);
      gameState.hands[action.playerIndex].splice(index, 1);

      const pointsForTurn = pointsFromPlay(action.tilePlayed, action.coord, gameState.gameBoard);
      gameState.scores[action.playerIndex] += pointsForTurn[0];

      gameState.lastPlay = action.coord;

      const hexagonOrBridge =
        pointsForTurn[1]
          ? " Hexagon!"
          : pointsForTurn[2]
          ? " Bridge!"
          : "";
      gameState.gameLog.push(`${gameState.playerNames[action.playerIndex]} plays [${action.tilePlayed.newTileID}] for ${pointsForTurn[0]} points.` + hexagonOrBridge);
      gameState.activePlayer = (action.playerIndex + 1) % gameState.hands.length; // next player's turn
      gameState.tilesDrawnThisTurn = 0; // reset tiles drawn counter after a play is made
      gameState.consecutivePasses = 0; // reset consecutive passes counter after a play is made
    } else if(action.actionType === 'draw') {
      if (!gameStarted) {
        // fix error from attempting to access inner arrays that don't exist
        if (!gameState.hands[action.playerIndex]) {
          gameState.hands[action.playerIndex] = [];
          gameState.scores[action.playerIndex] = 0;
        }
        // don't subtract points for drawing initial hand & don't log it
        gameState.hands[action.playerIndex].push(gameState.drawPile.pop()!);
      } else {
        // FOR LATER: Do I need to check if they can draw? There shouldn't be draw actions if not.
        if(gameState.drawPile.length > 0) {
          gameState.hands[action.playerIndex].push(gameState.drawPile.pop()!);
          gameState.tilesDrawnThisTurn += 1;
          gameState.scores[action.playerIndex] -= 5;
          gameState.gameLog.push(`${gameState.playerNames[action.playerIndex]} draws a tile and loses 5 points.`);
        } else {
          console.log("Can't draw, deck is empty.");
        }
      }
    } else if(action.actionType === 'pass') {
      gameState.scores[action.playerIndex] -= 10;
      gameState.gameLog.push(`${gameState.playerNames[action.playerIndex]} can not play and loses 10 points.`);

      gameState.activePlayer = (gameState.activePlayer + 1) % gameState.hands.length; // next player's turn
      gameState.tilesDrawnThisTurn = 0;
      gameState.consecutivePasses++;
    } else if(action.actionType === 'init') {
      const firstPlay: [number, number] = determineFirstPlay(gameState);
      const playerIndex = firstPlay[0];
      const tileIndex = firstPlay[1];
      const tilePlayed = gameState.hands[playerIndex][tileIndex];

      gameState.gameBoard.set("0,0", permuteTile(tilePlayed)[0]);

      gameState.hands[playerIndex].splice(tileIndex, 1);

      let pointsForTurn = tilePlayed.numbers.reduce((acc, value) => acc + value, 0);
      if (pointsForTurn === 0) {
        pointsForTurn += 30; // 30 points for starting with (0,0,0)
      } else if (tilePlayed.numbers[0] === tilePlayed.numbers[1] && tilePlayed.numbers[1] === tilePlayed.numbers[2]) {
        pointsForTurn += 10; // 10 bonus points for starting with a triple
      }
      // fix error from attempting to access inner arrays that don't exist
      if (!gameState.scores[playerIndex]) {
        gameState.scores[playerIndex] = 0;
      }
      gameState.scores[playerIndex] = pointsForTurn;

      gameState.lastPlay = {x:0, y:0};
      
      gameState.gameLog.push(`All players draw starting tiles.`);
      gameState.gameLog.push(`${gameState.playerNames[playerIndex]} plays [${tilePlayed.id}] and gains ${pointsForTurn} points.`);

      gameState.activePlayer = (playerIndex + 1) % gameState.hands.length;

      gameStarted = true;
    } else if(action.actionType === 'end') {
      // Find total remaining points in each player's hand
      let remainingPointsInHand: number[] = [];
      let playerWithNoTilesRemaining: number = -1;
      for (let i = 0; i < gameState.hands.length; i++) {
        let handValue = 0;
        for (const tile of gameState.hands[i]) {
          handValue += tile.numbers.reduce((sum, num) => sum + num, 0);
        }
        remainingPointsInHand.push(handValue);

        // Make a note if anyone went out
        if (gameState.hands[i].length === 0) {
          playerWithNoTilesRemaining = i;
        }
      }

      // If someone went out, they get total points from other players' hands + 25 bonus points
      if (playerWithNoTilesRemaining != -1) {
        const bonusPoints = 25 + remainingPointsInHand.reduce((sum, num) => sum + num, 0)
        gameState.scores[playerWithNoTilesRemaining] += bonusPoints;
        gameState.gameLog.push(`${gameState.playerNames[playerWithNoTilesRemaining]} went out and gains ${bonusPoints} bonus points.`);
      } else {
        // If no one went out, player(s) with lowest total value hand gain the value in excess of their hand from each other player 
        const lowestPointHand = Math.min(...remainingPointsInHand);
        for (let i = 0; i < gameState.scores.length; i++) {
          for (let j = 0; j < gameState.scores.length; j++) {
            gameState.scores[i] += Math.max(0, remainingPointsInHand[j] - lowestPointHand);
          }
        }
      }

      // FOR LATER: Games should persist across multiple rounds and only end when one player breaks the total score.
      // Traditionally this is 400 points, but there should be an option at setup for how many points to play to.
      const winner: number = gameState.scores.indexOf(Math.max(...gameState.scores));
      gameState.gameLog.push(`Game over. ${gameState.playerNames[winner]} wins!`);
      gameState.activePlayer = -1; // Deactivate active-player.gif
    }
    else {
      console.log("Not a valid action.");
    }
  });

  return gameState;
}

export function isGameOver(gameState: GameState): Boolean {
  // Check if anyone's hand is empty
  let isEmpty: Boolean = false;
  for (let i = 0; i < gameState.hands.length; i++) {
    if (gameState.hands[i].length === 0) {
      isEmpty = true;
    }
  }
  
  return isEmpty || (gameState.consecutivePasses === gameState.playerNames.length && gameState.drawPile.length === 0);
}