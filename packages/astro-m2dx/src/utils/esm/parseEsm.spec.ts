import { describe, expect, test } from 'vitest';
import { parseEsm } from './parseEsm';

describe('parseEsm', function () {
  test('empty', function () {
    const input = ``;
    const actual = parseEsm(input);
    expect(actual.type).toBe('Program');
    expect(actual.body.length).toBe(0);
  });

  test('empty', function () {
    const input = `
import { value } from 'values';

// comment: double the value
export const double = value + value;
`;
    const actual = parseEsm(input);
    expect(actual.type).toBe('Program');
    expect(actual.body.length).toBe(2);
  });
});
