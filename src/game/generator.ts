import { replayHistory } from "./history";
import { MAX_DRAW, determineAction } from "./logic";
import { FirebaseGameData, GameHistory, GameState, NewTile, PlacedTile } from "./types";

export function genNewTile(nums: [number, number, number]): NewTile {
  return {
    id: nums.join(","), 
    numbers: nums,
  };
}

export function makeNewTiles(): NewTile[] {
  const newTiles: NewTile[] = [];

  // Make all of the possible triominoes from (0,0,0) to (5,5,5)
  // (0,0,0), (0,0,1), ... (0,0,5), (0,1,1), ... (5,5,5)
  for(let i = 0; i <= 5; i++) {
    for(let j = i; j <= 5; j++) {
      for(let k = j; k <=5 ; k++) {
        newTiles.push( genNewTile([i,j,k]) );
      }
    }
  }

  // Shuffle the tiles
  for(let i=0; i<newTiles.length; i++) {
    // Pick a random number between 0 and # of newBlocks
    let shuffle = Math.floor(Math.random() * (newTiles.length));
    
    // Swap the current with a random position
    [ newTiles[i], newTiles[shuffle] ] = [ newTiles[shuffle], newTiles[i] ];
  }

  return newTiles;
}

// Given a NewBlock, return 3 permutations of As and Bs
export function permuteTile( tile:NewTile ): PlacedTile[] {
  return [{
  // Return the 6 permutations in order as you rotate them 60 degrees clockwise
    orientation: 'up',
    newTileID: tile.id,
    topCenter: tile.numbers[0],
    bottomRight: tile.numbers[1],
    bottomLeft: tile.numbers[2],
  }, {
    orientation: 'down',
    newTileID: tile.id,
    bottomCenter: tile.numbers[1],
    topLeft: tile.numbers[2],
    topRight: tile.numbers[0],
  }, {
    orientation: 'up',
    newTileID: tile.id,
    topCenter: tile.numbers[2],
    bottomRight: tile.numbers[0],
    bottomLeft: tile.numbers[1],
  }, {
    orientation: 'down',
    newTileID: tile.id,
    bottomCenter: tile.numbers[0],
    topLeft: tile.numbers[1],
    topRight: tile.numbers[2],
  }, {
    orientation: 'up',
    newTileID: tile.id,
    topCenter: tile.numbers[1],
    bottomRight: tile.numbers[2],
    bottomLeft: tile.numbers[0],
  }, {
    orientation: 'down',
    newTileID: tile.id,
    bottomCenter: tile.numbers[2],
    topLeft: tile.numbers[0],
    topRight: tile.numbers[1],
  }];
}

// Extract NewTile from PlacedTile
export function placedTileToNewTile(placedTile: PlacedTile): NewTile {
  const numbers = placedTile.newTileID.split(',').map(Number);
  return {
    id: placedTile.newTileID,
    numbers: numbers as [number, number, number],
  };
}

export function initializeNewGameHistory(gameData: FirebaseGameData): GameHistory {
  const numPlayers = gameData.numPlayers;
  const playerNames: string[] = gameData.players.map(player => player.playerName);

  const history: GameHistory = {
    startingDeck: makeNewTiles(),
    actions: [],
  };

  // Generate AddPlayer actions based on FirebaseGameData.players info
  // FOR LATER: Consider how this works with various combos of human/spectator
  // FOR LATER: Should players be able to join a game mid-way and take over computer slot?
  // FOR LATER: Should players be able to join a game in a new round and take over computer slot?
  for (let i = 0; i < numPlayers; i++) {
    if (i < gameData.players.length) {
      history.actions.push({
        actionType: 'add-player',
        playerName: gameData.players[i].playerName,
        playerID: gameData.players[i].localPlayerID,
      });
    } else {
      history.actions.push({
        actionType: 'add-player',
        playerName: "Computer " + `${i + 1 - playerNames.length}`,
        playerID: "null",
      });
    }
  }
  // Starting tiles depends on number of players
  //    2 players start with 9 tiles each
  //    3-4 players start with 7 tiles each
  //    5-6 players start with 6 tiles each
  const startingTiles = {
    1: 9,
    2: 9,
    3: 7,
    4: 7,
    5: 6,
    6: 6,
  }[numPlayers]!;

  for(let i = 0; i < numPlayers; i++) {
    for(let j = 0; j < startingTiles; j++) {
      history.actions.push({
        actionType: 'draw',
        playerIndex: i, 
      });
    }
  }

  history.actions.push({actionType: 'init'});

  return history;
}

export function eraseGameHistory(gameHistory: GameHistory): GameHistory {
  const index = gameHistory.actions.findIndex(action => action.actionType === 'init');

  return {
    startingDeck: gameHistory.startingDeck,
    actions: [...gameHistory.actions].slice(0, index+1),
  };
}

export function simulateOneAction(gameHistory: GameHistory): GameHistory {
  const simulatedHistory: GameHistory = {
    startingDeck: gameHistory.startingDeck,
    actions: [...gameHistory.actions],
  }
  let gameState: GameState = replayHistory(simulatedHistory);

  let isEmpty: Boolean = false;
  for (let i=0; i < gameState.hands.length; i++) {
    if (gameState.hands[i].length === 0) {
      isEmpty = true;
    }
  }

  if( gameHistory.actions[gameHistory.actions.length - 1].actionType != 'end') {
    if (isEmpty || (gameState.consecutivePasses === gameState.playerNames.length && gameState.drawPile.length === 0)) {
      simulatedHistory.actions.push({
        actionType: 'end',
      });
    } else {
      // Automatically make a play for computer
      const activePlayerName = gameState.playerNames[gameState.activePlayer];
      if( activePlayerName.startsWith("Computer") ) {
        simulatedHistory.actions.push(determineAction(gameState, gameState.activePlayer));
      } else {
        // Don't automatically make a play for human. Let them draw up to MAX_DRAW and then pass.
        if( gameState.tilesDrawnThisTurn < MAX_DRAW && gameState.drawPile.length > 0 ) {
          simulatedHistory.actions.push({
            actionType: 'draw',
            playerIndex: gameState.activePlayer,
          });
        } else {
          simulatedHistory.actions.push({
            actionType: 'pass',
            playerIndex: gameState.activePlayer,
          });
        }
      }
    }
  }
  return simulatedHistory;
}

// Plays out the rest of the game from current point, making every player's moves for them
export function simulateCompleteGame(gameHistory: GameHistory): GameHistory {
  const simulatedHistory: GameHistory = {
    startingDeck: gameHistory.startingDeck,
    actions: [...gameHistory.actions],
  }
  let gameState: GameState = replayHistory(simulatedHistory);
  let gameOver: Boolean = simulatedHistory.actions[simulatedHistory.actions.length - 1].actionType === 'end';

  while(!gameOver) {
    simulatedHistory.actions.push(determineAction(gameState, gameState.activePlayer));
    gameState = replayHistory(simulatedHistory);

    gameOver =
      gameState.hands.some(hand => hand.length === 0) ||
      (gameState.consecutivePasses === gameState.playerNames.length && gameState.drawPile.length === 0) ||
      simulatedHistory.actions.length > 500;

    if(gameOver) {
      simulatedHistory.actions.push({actionType: 'end'});
    }
  }

  return simulatedHistory;
}