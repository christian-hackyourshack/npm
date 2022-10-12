import { assert, describe } from 'mintest-green';
import { isImportDeclaration } from './estree';

await describe('estree', function (test) {
  test('isImportDeclaration', function () {
    const input = { type: 'ImportDeclaration' };
    assert.equal(isImportDeclaration(input), true);
  });
});
