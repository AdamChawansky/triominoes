// (0,0,0), (0,0,1), ... (0,0,5), (0,1,1), ... (5,5,5)

import { Coordinate } from "./types";

// Function to turn coordinates into keys
export function toKey( coord: Coordinate): string {
  return `${coord.x},${coord.y}`;
}
// Function to turn keys into coordinates
export function toCoord( key: string ): Coordinate {
  const temp = key.split(',');
  return {
    x: Number(temp[0]),
    y: Number(temp[1]),
  };
}
