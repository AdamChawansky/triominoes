import { replayHistory } from "./history";
import { determineAction } from "./logic";
import { GameHistory, GameState, NewBlock, PlacedBlock } from "./types";

export function genNewBlock(nums: [number, number, number]): NewBlock {
  return {
    id: nums.join(","), 
    numbers: nums,
  };
}

export function makeNewBlocks(): NewBlock[] {
  const newBlocks: NewBlock[] = [];

  // Make all of the possible triominoes from (0,0,0) to (5,5,5)
  // (0,0,0), (0,0,1), ... (0,0,5), (0,1,1), ... (5,5,5)
  for(let i = 0; i <= 5; i++) {
    for(let j = i; j <= 5; j++) {
      for(let k = j; k <=5 ; k++) {
        newBlocks.push( genNewBlock([i,j,k]) );
      }
    }
  }

  // Shuffle the tiles
  for(let i=0; i<newBlocks.length; i++) {
    // Pick a random number between 0 and # of newBlocks
    let shuffle = Math.floor(Math.random() * (newBlocks.length));
    
    // Swap the current with a random position
    [ newBlocks[i], newBlocks[shuffle] ] = [ newBlocks[shuffle], newBlocks[i] ];
  }

  return newBlocks;
}

// Given a NewBlock, return 3 permutations of As and Bs
export function permuteBlock( tile:NewBlock ): PlacedBlock[] {
  return [{
  // Make the 3 A types
    orientation: 'up',
    newBlockID: tile.id,
    topCenter: tile.numbers[0],
    bottomRight: tile.numbers[1],
    bottomLeft: tile.numbers[2],
  }, {
    orientation: 'up',
    newBlockID: tile.id,
    topCenter: tile.numbers[1],
    bottomRight: tile.numbers[2],
    bottomLeft: tile.numbers[0],
  }, {
    orientation: 'up',
    newBlockID: tile.id,
    topCenter: tile.numbers[2],
    bottomRight: tile.numbers[0],
    bottomLeft: tile.numbers[1],
  }, {
  // Make the 3 B types
    orientation: 'down',
    newBlockID: tile.id,
    bottomCenter: tile.numbers[0],
    topLeft: tile.numbers[1],
    topRight: tile.numbers[2],
  }, {
    orientation: 'down',
    newBlockID: tile.id,
    bottomCenter: tile.numbers[1],
    topLeft: tile.numbers[2],
    topRight: tile.numbers[0],
  }, {
    orientation: 'down',
    newBlockID: tile.id,
    bottomCenter: tile.numbers[2],
    topLeft: tile.numbers[0],
    topRight: tile.numbers[1],
  }];
}

export function initializeNewGameHistory(numPlayers: number): GameHistory {
  const history: GameHistory = {
    startingDeck: makeNewBlocks(),
    actions: [],
  };

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

  if( gameState.hands[gameState.activePlayer].length > 0 && gameState.drawPile.length > 0) {
    simulatedHistory.actions.push(determineAction(gameState, gameState.activePlayer));
  }
  return simulatedHistory;
}

export function simulateCompleteGame(gameHistory: GameHistory): GameHistory {
  const simulatedHistory: GameHistory = {
    startingDeck: gameHistory.startingDeck,
    actions: [...gameHistory.actions],
  }
  let gameState: GameState = replayHistory(simulatedHistory);
  let playerIndex = 0;

  while( gameState.hands[0].length > 0 && simulatedHistory.actions.length < 1000) {
    simulatedHistory.actions.push(determineAction(gameState, playerIndex));
    gameState = replayHistory(simulatedHistory);
    // todo switch playerIndex?

    // End states:
    // 1) A player plays their last tile (any hand[i] === 0)
    //    That player earns 25 points + the total points of everyone else's tiles
    // 2) The drawPile is empty and all players pass, meaning no more moves possible.
    //    Each player loses points equal to sum of their own tiles
  }

  return simulatedHistory;
}