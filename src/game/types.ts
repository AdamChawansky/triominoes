// These components are used with the firebase
export const QueryParam = {
  gameID: 'gameID',
} as const;

export interface FirebaseGameData {
  gameID: string;
  numPlayers: number;
  gameHistory: GameHistory;
  players: {
    localPlayerID: string; // unique identifier
    playerName: string; // human player name for score, log, and chat
    playerType: 'human' | 'computer' | 'spectator';
  }[];
  gameInProgress: boolean;
  messageHistory: MessageHistory;
}

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
  playerNames: string[];
  hands: NewTile[][];
  scores: number[];
  drawPile: NewTile[];
  gameLog: String[];
  activePlayer: number;
  tilesDrawnThisTurn: number;
  consecutivePasses: number;
  lastPlay: Coordinate;
}

export type GameHistory = {
  startingDeck: NewTile[];
  actions: Action[]; 
}

export type Action = 
  | AddPlayerAction
  | InitialTileAction
  | PlayAction
  | DrawAction
  | PassAction
  | EndGameAction;

export type AddPlayerAction = {
  actionType: 'add-player';
  playerName: string;
  playerID: string; // the UUID we generate in App.tsx
}

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

export type PassAction = {
  actionType: 'pass';
  playerIndex: number;
}

export type InitialTileAction = {
  actionType: 'init';
}

export type EndGameAction = {
  actionType: 'end';
}

export type ActionPusher = (action: Action) => void;

export interface Message {
  playerName: string;
  playerIndex: number;
  content: string;
}

export interface MessageHistory {
  messages: Message[];
}