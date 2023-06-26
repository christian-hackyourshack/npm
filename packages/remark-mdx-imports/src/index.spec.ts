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
const remarkImportlessJsx = plugin();

const fixtures = fileURLToPath(new URL('../fixtures', import.meta.url));

export const result = await describe('remark-mdx-imports', function (test) {
  test('playground', async () => {
    const file = join(fixtures, '/sub/test.mdx');
    const actual = parser.parse(readFileSync(file, 'utf8'));
    remarkImportlessJsx(actual, { dirname: dirname(file) });
    const importStatements = actual.children.filter(isMdxjsEsm);
    assert.equal(importStatements.length, 2);

    assert.equal(importStatements[0].value, `import { Title } from '${fixtures}/_components.ts'`);
    assert.equal(importStatements[1].value, `import { Hero } from '${fixtures}/sub/_components.ts'`);
  })
});
