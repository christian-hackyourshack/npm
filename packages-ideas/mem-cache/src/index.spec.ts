import { describe, expect, test } from 'vitest';
import { MemCache } from './index';

describe('mem-cache', function () {
  test('MemCache does not recompute for identical input', function () {
    let i = 0;
    // This function is not stateless to demonstrate the correct working of the cache
    function foo(a: string, b: number) {
      return `[${i++}] ${a} - ${b}`;
    }
    const cache = new MemCache(foo);

    const actual = cache.get('a', 8);
    const expected = cache.get('a', 8);
    expect(actual).toEqual(expected);

    // Just to demonstrate the difference
    const a = foo('a', 8);
    const b = foo('a', 8);
    expect(a).not.toEqual(b);
  });
});
