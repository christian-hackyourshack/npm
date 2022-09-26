import { describe, expect, test } from 'vitest';
import { findAllImportSpecifiers } from './findAllImportSpecifiers';
import { parseMdx } from './parseMdx';

describe('findAllImportSpecifiers', function () {
  test('individual lines', function () {
    const input = parseMdx(`
import c, {a, b} from 'c';

import d from 'd';
`);
    const found = findAllImportSpecifiers(input);
    expect(found.length).toBe(4);
  });

  test('continuous lines', function () {
    const input = parseMdx(`
import c, {a, b} from 'c';
import d from 'd';

<A />
`);
    const found = findAllImportSpecifiers(input);
    expect(found.length).toBe(4);
  });
});
