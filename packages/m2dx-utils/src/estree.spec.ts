import { assert, describe } from 'mintest-green';
import { isImportDeclaration } from './estree';

export const result = await describe('estree', function (test) {
  test('isImportDeclaration', function () {
    const input = { type: 'ImportDeclaration' };
    assert.equal(isImportDeclaration(input), true);
  });
});
