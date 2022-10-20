import { assert, describe } from 'mintest-green';
import { isImportDeclaration } from '../esm';
import { createProgram } from './createProgram';

await describe('createProgram', function (test) {
  test('default import', function () {
    const actual = createProgram(`import d from 'd.js';`);
    const decl = actual.data!.estree!.body[0];
    if (isImportDeclaration(decl)) {
      assert.equal(decl.source.value, 'd.js');
      assert.equal(decl.specifiers.length, 1);
      assert.equal(decl.specifiers[0].type, 'ImportDefaultSpecifier');
      assert.equal(decl.specifiers[0].local.name, 'd');
    } else {
      assert.fail('body is not an ImportDeclaration');
    }
  });

  test('named import', function () {
    const actual = createProgram(`import { a } from 'a';`);
    const decl = actual.data!.estree!.body[0];
    if (isImportDeclaration(decl)) {
      assert.equal(decl.source.value, 'a');
      assert.equal(decl.specifiers.length, 1);
      assert.equal(decl.specifiers[0].local.name, 'a');
    } else {
      assert.fail('body is not an ImportDeclaration');
    }
  });

  test('renamed named import', function () {
    const actual = createProgram(`import { a as AutoImport } from 'a';`);
    const decl = actual.data!.estree!.body[0];
    if (isImportDeclaration(decl)) {
      assert.equal(decl.source.value, 'a');
      assert.equal(decl.specifiers.length, 1);
      assert.equal(decl.specifiers[0].local.name, 'AutoImport');
    } else {
      assert.fail('body is not an ImportDeclaration');
    }
  });
});
