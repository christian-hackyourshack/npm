import { parseMdx } from 'm2dx-utils';
import { assert, describe } from 'mintest-green';
import { exportComponents } from '.';
import { findExportInMdx } from './findExportInMdx';

export const result = await describe('exportComponents', function (test) {
  test('single file, no existing components', function () {
    const input = parseMdx(`
# My Title

Some text.
`);
    exportComponents(input, ['_foo.ts']);
    assert.equal(input.children.length, 4);
    assert.objectContaining(input.children[2], {
      value: `import { components as _ac0 } from '_foo.ts';`,
    });
    assert.objectContaining(input.children[3], { value: `export const components = {..._ac0};` });
  });

  test('multiple files, no existing components', function () {
    const input = parseMdx(`
# My Title

Some text.
`);
    exportComponents(input, ['_foo.ts', '_bar.ts', '_baz.ts']);
    assert.equal(input.children.length, 4);
    assert.objectContaining(input.children[2], {
      value: `import { components as _ac0 } from '_foo.ts';
import { components as _ac1 } from '_bar.ts';
import { components as _ac2 } from '_baz.ts';`,
    });
    assert.objectContaining(input.children[3], {
      value: `export const components = {..._ac0,..._ac1,..._ac2};`,
    });
  });

  test('single file, existing components', function () {
    const input = parseMdx(`
# My Title

Some text.

import Title from "../../Title.astro";
export const components = {
  h1: Title,
  h2: H2,
}
`);
    exportComponents(input, ['_foo.ts']);
    assert.equal(input.children.length, 4);
    assert.objectContaining(input.children[3], {
      value: `import { components as _ac0 } from '_foo.ts';`,
    });
    const decl = findExportInMdx(input);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const init = decl!.init! as any;
    assert.equal(init.properties.length, 3);
    // Make sure the spread elements are added first.
    assert.equal(init.properties[0].type, 'SpreadElement');
  });
});
