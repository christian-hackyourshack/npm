import { describe, expect, test } from 'vitest';
import { parseMdx } from './parseMdx';
import { findAllImages } from './findAllImages';

describe('findAllImages', function () {
  test('playground', function () {
    const input = parseMdx(`
![Astronaut with vacuum cleaner](astronaut-with-vacuum-cleaner.png)

`);
    const found = findAllImages(input);
    expect(found.length).toBe(1);
  });
});
