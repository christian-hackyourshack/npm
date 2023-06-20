import { isMdxjsEsm } from '@internal/mdast-util-mdx';
import { readFileSync } from 'fs';
import { assert, describe } from 'mintest-green';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { fileURLToPath } from 'url';
import { VFile } from 'vfile';
import plugin from '.';

const parser = unified()
  .use(remarkParse)
  .use(remarkMdx);
const remarkImportlessJsx = plugin();

export const result = await describe('remark-importless-jsx', function (test) {
  test('playground', async () => {
    const file = fileURLToPath(new URL('../fixtures/sub/test.mdx', import.meta.url));
    const vfile = new VFile({
      path: file,
      value: readFileSync(file, 'utf8')
    });

    const actual = parser.parse(vfile.value as string);
    remarkImportlessJsx(actual, vfile);
    const importStatements = actual.children.filter(isMdxjsEsm);
    assert.equal(importStatements.length, 2);

    const fixtures = fileURLToPath(new URL('../fixtures', import.meta.url));
    assert.equal(importStatements[0].value, `import { Title } from '${fixtures}/_components.ts'`);
    assert.equal(importStatements[1].value, `import { Hero } from '${fixtures}/sub/_components.ts'`);
  })
});
