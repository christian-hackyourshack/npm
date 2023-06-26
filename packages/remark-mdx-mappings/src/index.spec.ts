import { isMdxjsEsm } from '@internal/mdast-util-mdx';
import { readFileSync } from 'fs';
import { assert, describe } from 'mintest-green';
import { dirname } from 'path';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { fileURLToPath } from 'url';
import plugin from '.';

const parser = unified()
  .use(remarkParse)
  .use(remarkMdx);
const transform = plugin();

export const result = await describe('remark-mdx-mappings', function (test) {
  test('playground', async () => {
    const file = fileURLToPath(new URL('../fixtures/sub/test.mdx', import.meta.url));

    const actual = parser.parse(readFileSync(file, 'utf8'));
    transform(actual, { dirname: dirname(file) });
    const mdxStatements = actual.children.filter(isMdxjsEsm);
    assert.equal(mdxStatements.length, 2);

    const fixtures = fileURLToPath(new URL('../fixtures', import.meta.url));
    assert.equal(mdxStatements[0].value, `
import { components as _components0 } from '${fixtures}/sub/_components.ts'
import { components as _components1 } from '${fixtures}/_components.ts'
`.trim());
    assert.equal(mdxStatements[1].value, 'export const components = { ..._components0, ..._components1 };');
  })
});
