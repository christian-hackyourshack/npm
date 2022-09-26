import { describe, expect, test } from 'vitest';
import { isObjectLike } from './ObjectLike';

describe('isObjectLike', function () {
  test('Empty object', function () {
    expect(isObjectLike({})).toBe(true);
  });

  test('Normal object', function () {
    expect(isObjectLike({ a: 'Foo' })).toBe(true);
  });

  test('Map', function () {
    expect(isObjectLike(new Map())).toBe(true);
  });

  test('Record', function () {
    const record: Record<string, string> = { 'a key': 'a value' };
    expect(isObjectLike(record)).toBe(true);
  });

  test('Array', function () {
    expect(isObjectLike([])).toBe(false);
  });

  test('Array', function () {
    expect(isObjectLike([{ a: 'foo' }])).toBe(false);
  });

  test('undefined', function () {
    expect(isObjectLike(undefined)).toBe(false);
  });
});
