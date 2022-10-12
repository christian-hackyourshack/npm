import { assert, describe } from 'mintest-green';
import { findAllImportSpecifiers } from './findAllImportSpecifiers';
import { parseMdx } from './parseMdx';

await describe('findAllImportSpecifiers', function (test) {
  test('individual lines', function () {
    const input = parseMdx(`
import c, {a, b} from 'c';

import d from 'd';
`);
    const found = findAllImportSpecifiers(input);
    assert.equal(found.length, 4);
  });

  test('continuous lines', function () {
    const input = parseMdx(`
import c, {a, b} from 'c';
import d from 'd';

<A />
`);
    const found = findAllImportSpecifiers(input);
    assert.equal(found.length, 4);
  });
});
