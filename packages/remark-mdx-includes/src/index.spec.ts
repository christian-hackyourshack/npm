import { loadVFile, type Node } from '@internal/mdast-util';
import type { MdxjsEsm, MdxJsxFlowElement } from '@internal/mdast-util-mdx';
import { assert, describe } from 'mintest-green';
import remarkDirective from 'remark-directive';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import remarkSectionizeHeadings from 'remark-sectionize-headings';
import { unified } from 'unified';
import { fileURLToPath } from 'url';
import plugin from '.';

const fixtures = fileURLToPath(new URL('../fixtures', import.meta.url));

export const result = await describe('remark-mdx-includes', function (test) {
  test('playground', async () => {
    const parser = unified()
      .use(remarkParse)
      .use(remarkDirective)
      .use(remarkMdx);

    const file = await loadVFile(fixtures, 'sub', 'test.mdx');
    const root = parser.parse(file);
    const sectionize = remarkSectionizeHeadings();
    sectionize(root);
    const mdxIncludes = plugin();
    mdxIncludes(root, file);
    assert.equal(root.children.length, 3, 'Incorrect number of children');
    assert.equal(root.children[1].type, 'mdxjsEsm', 'Incorrect type');
    assert.equal((root.children[1] as MdxjsEsm).value, `import * as Include__0 from '${fixtures}/sub/section.mdx';`, 'Incorrect type');
    assert.equal(root.children[2].type, 'mdxjsEsm', 'Incorrect type');
    assert.equal((root.children[2] as MdxjsEsm).value, `import * as Include__1 from '${fixtures}/partial.mdx';`, 'Incorrect type');

    let section = root.children[0] as Section;
    let include = section.children[2] as MdxJsxFlowElement;
    assert.equal(include.type, 'mdxJsxFlowElement', 'Incorrect type');
    assert.equal(include.name, 'Include__0.Content', 'Incorrect element name');

    section = section.children[3] as Section;
    include = section.children[2] as MdxJsxFlowElement;
    assert.equal(include.type, 'mdxJsxFlowElement', 'Incorrect type');
    assert.equal(include.name, 'Include__1.Content', 'Incorrect element name');
  })
});

interface Section extends Node {
  children: Node[];
}
