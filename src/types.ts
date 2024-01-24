export type PlacedBlockA = {
  topCenter: number;
  bottomLeft: number;
  bottomRight: number;
}

export type PlacedBlockB = {
  bottomCenter: number;
  topLeft: number;
  topRight: number;
}

export type PlacedBlock = PlacedBlockA | PlacedBlockB;

// clockwise
export type NewBlock = [number, number, number];
