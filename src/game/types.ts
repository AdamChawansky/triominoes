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
  // gameLog:
  // lastPlay: Coordinate;
}
