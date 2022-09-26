import { describe, expect, test } from 'vitest';
import { parseMdx } from './parseMdx';

describe('parseMdx', function () {
  test('empty', function () {
    const actual = parseMdx(``);
    expect(actual.type).toBe('root');
    expect(actual.children.length).toBe(0);
  });

  test('empty', function () {
    const actual = parseMdx(`
import { value } from 'values';
export const double = value + value;

# Finally, the Title

A paragraph to start with...
`);
    expect(actual.type).toBe('root');
    expect(actual.children.length).toBe(3);
  });
});
