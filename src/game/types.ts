export type PlacedBlockA = {
  newBlockID: string;
  orientation: 'up';
  topCenter: number;
  bottomLeft: number;
  bottomRight: number;
}

export type PlacedBlockB = {
  newBlockID: string;
  orientation: 'down';
  bottomCenter: number;
  topLeft: number;
  topRight: number;
}

export type PlacedBlock = PlacedBlockA | PlacedBlockB;

// clockwise
export type NewBlock = {
  id: string;
  numbers: [number, number, number];
}

export type Coordinate = {
  x: number;
  y: number;
}

// Treat game board  as a hash table with (0,0) as the origin. Keys are (x,y) coordinates.
export type GameBoard = Map<string, PlacedBlock>;

export type PotentialMove = {
  coord: Coordinate;
  newBlock: NewBlock;
  placedBlock: PlacedBlock;
}

export type GameState = {
  gameBoard: GameBoard;
  hands: NewBlock[][];
  scores: number[];
  drawPile: NewBlock[];
  gameLog: String[];
  activePlayer: number,
  lastPlay: Coordinate;
}

export type GameHistory = {
  startingDeck: NewBlock[];
  actions: Action[]; 
}

export type Action = 
  | InitialTileAction
  | PlayAction
  | DrawAction
  | EndGameAction;

export type PlayAction = {
  actionType: 'play';
  playerIndex: number;
  tilePlayed: PlacedBlock;
  coord: Coordinate;
}

export type DrawAction = {
  actionType: 'draw';
  playerIndex: number;
}

export type InitialTileAction = {
  actionType: 'init';
}

export type EndGameAction = {
  actionType: 'end';
}

export type ActionPusher = (action: Action) => void;