import { describe, expect, test } from 'vitest'
import { toCoord, toKey } from '../util';

describe('util tests', () => {
  test('Key <--> Coord', () => {
    expect(toKey({ x: 2, y: 3 })).toBe("2,3");
    expect(toCoord("2,3")).toStrictEqual({x: 2, y: 3});
  });
});