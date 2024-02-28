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