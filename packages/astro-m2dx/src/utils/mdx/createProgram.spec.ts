import { describe, expect, test } from 'vitest';
import { isImportDeclaration } from '../esm';
import { createProgram } from './createProgram';

describe('createProgram', function () {
  test('default import', function () {
    const actual = createProgram(`import d from 'd.js';`);
    const decl = actual.data!.estree!.body[0];
    if (isImportDeclaration(decl)) {
      expect(decl.source.value).toBe('d.js');
      expect(decl.specifiers.length).toBe(1);
      expect(decl.specifiers[0].type).toBe('ImportDefaultSpecifier');
      expect(decl.specifiers[0].local.name).toBe('d');
    } else {
      expect.fail('body is not an ImportDeclaration');
    }
  });

  test('named import', function () {
    const actual = createProgram(`import { a } from 'a';`);
    const decl = actual.data!.estree!.body[0];
    if (isImportDeclaration(decl)) {
      expect(decl.source.value).toBe('a');
      expect(decl.specifiers.length).toBe(1);
      expect(decl.specifiers[0].local.name).toBe('a');
    } else {
      expect.fail('body is not an ImportDeclaration');
    }
  });

  test('renamed named import', function () {
    const actual = createProgram(`import { a as AutoImport } from 'a';`);
    const decl = actual.data!.estree!.body[0];
    if (isImportDeclaration(decl)) {
      expect(decl.source.value).toBe('a');
      expect(decl.specifiers.length).toBe(1);
      expect(decl.specifiers[0].local.name).toBe('AutoImport');
    } else {
      expect.fail('body is not an ImportDeclaration');
    }
  });
});
