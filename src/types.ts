export type PlacedBlockA = {
  orientation: 'up';
  topCenter: number;
  bottomLeft: number;
  bottomRight: number;
}

export type PlacedBlockB = {
  orientation: 'down';
  bottomCenter: number;
  topLeft: number;
  topRight: number;
}

export type PlacedBlock = PlacedBlockA | PlacedBlockB;

// clockwise
export type NewBlock = [number, number, number];

export type Coordinate = {
  x: number;
  y: number;
}