import { describe, expect, test } from 'vitest';
import { isHeading } from './mdast';

describe('mdast', function () {
  test('Heading', function () {
    const input = { type: 'heading' };
    expect(isHeading(input)).toBe(true);
  });
});
