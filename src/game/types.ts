export type PlacedTileA = {
  newTileID: string;
  orientation: 'up';
  topCenter: number;
  bottomLeft: number;
  bottomRight: number;
}

export type PlacedTileB = {
  newTileID: string;
  orientation: 'down';
  bottomCenter: number;
  topLeft: number;
  topRight: number;
}

export type PlacedTile = PlacedTileA | PlacedTileB;

// clockwise
export type NewTile = {
  id: string;
  numbers: [number, number, number];
}

export type Coordinate = {
  x: number;
  y: number;
}

// Treat game board  as a hash table with (0,0) as the origin. Keys are (x,y) coordinates.
export type GameBoard = Map<string, PlacedTile>;

export type PotentialMove = {
  coord: Coordinate;
  newTile: NewTile;
  placedTile: PlacedTile;
}

export type GameState = {
  gameBoard: GameBoard;
  hands: NewTile[][];
  scores: number[];
  drawPile: NewTile[];
  gameLog: String[];
  activePlayer: number,
  tilesDrawnThisTurn: number,
  lastPlay: Coordinate;
}

export type GameHistory = {
  startingDeck: NewTile[];
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
  tilePlayed: PlacedTile;
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