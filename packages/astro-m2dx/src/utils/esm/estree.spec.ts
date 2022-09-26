import { describe, expect, test } from 'vitest';
import { isImportDeclaration } from './estree';

describe('estree', function () {
  test('isImportDeclaration', function () {
    const input = { type: 'ImportDeclaration' };
    expect(isImportDeclaration(input)).toBe(true);
  });
});
