import { describe, expect, test } from 'vitest'
import { makeNewTiles } from '../generator';

describe('generator tests', () => {
  test('makeNewBlocks', () => {
    const newBlocks = makeNewTiles();
    expect(newBlocks.length).toBe(56);

    const findOneBlock = newBlocks.filter(block => {
      return block.id === "0,0,0";
    });
    expect(findOneBlock).toStrictEqual([{
      id:"0,0,0", 
      numbers:[0,0,0],
    }]);

    const illegalBlocks = newBlocks.filter(block => {
      return block.numbers.some(n => n > 5 || n < 0);
    });
    expect(illegalBlocks).toStrictEqual([]);
  });
});