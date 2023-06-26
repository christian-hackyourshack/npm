import { isMdxjsEsm } from '@internal/mdast-util-mdx';
import { readFileSync } from 'fs';
import { assert, describe } from 'mintest-green';
import { dirname, join } from 'path';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { fileURLToPath } from 'url';
import plugin from '.';

const parser = unified()
  .use(remarkParse)
  .use(remarkMdx);
const transform = plugin();
const fixtures = fileURLToPath(new URL('../fixtures', import.meta.url));

export const result = await describe('remark-mdx-mappings', function (test) {
  test('playground', async () => {
    const file = join(fixtures, 'sub/test.mdx');
    const actual = parser.parse(readFileSync(file, 'utf8'));
    transform(actual, { dirname: dirname(file) });
    const mdxStatements = actual.children.filter(isMdxjsEsm);
    assert.equal(mdxStatements.length, 2);

    assert.equal(mdxStatements[0].value, `
import { components as _components0 } from '${fixtures}/_components.ts'
import { components as _components1 } from '${fixtures}/sub/_components.ts'
`.trim());
    assert.equal(mdxStatements[1].value, 'export const components = { ..._components0, ..._components1 };');
  })
});
