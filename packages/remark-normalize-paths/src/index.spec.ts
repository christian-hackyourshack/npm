import { List, isImage, isLeafDirective, isLink } from '@internal/mdast-util';
import { MdxJsxFlowElement, isMdxJsxAttribute, isMdxJsxFlowElement } from '@internal/mdast-util-mdx';
import { readFileSync } from 'fs';
import { assert, describe } from 'mintest-green';
import { dirname, join } from 'path';
import { EXIT, Predicate, visit } from 'pre-visit';
import rehypeStringify from 'rehype-stringify';
import remarkDirective from 'remark-directive';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { fileURLToPath } from 'url';
import { VFile } from 'vfile';
import remarkNormalizePaths from '.';

const parser = unified()
  .use(remarkParse)
  .use(remarkDirective)
  .use(remarkMdx);
const fixtures = fileURLToPath(new URL('../fixtures', import.meta.url));

export const result = await describe('remark-normalize-paths', function (test) {
  test('playground', async function () {
    const actual = parser.parse(`
![](./picture.jpg)

[Read more](./all/index.html)

<img src="../other-picture.png" />

::Quote[MDX is great]{author="Me" avatar="./me.jpg" .xxl}

<CustomComponent ref="./input.txt" />

`);
    const dir = process.cwd();
    const parentDir = dirname(dir);
    const transform = remarkNormalizePaths({ exclude: ["link", "<CustomComponent>"] });
    transform(actual, { dirname: dir });

    assert.equal(find(actual, isImage)!.url, `${dir}/picture.jpg`);
    assert.equal(find(actual, isLink)!.url, './all/index.html');
    assert.equal(
      find(actual, isJsxComponent('img'))!.attributes.find((a) => isMdxJsxAttribute(a) && a.name === 'src')
        ?.value,
      `${parentDir}/other-picture.png`
    );
    assert.equal(find(actual, isLeafDirective)!.attributes['avatar'], `${dir}/me.jpg`);
    assert.equal(
      find(actual, isJsxComponent('CustomComponent'))!.attributes.find(
        (a) => isMdxJsxAttribute(a) && a.name === 'ref'
      )?.value,
      './input.txt'
    );
  });

  test('processor', async function () {
    const processor = unified()
      .use(remarkParse)
      .use(remarkDirective)
      .use(remarkNormalizePaths, { checkExistence: true })
      .use(expandDirectives)
      .use(remarkRehype)
      .use(rehypeStringify);
    // construct an absolute path to the test file using import.meta.url
    const file = join(fixtures, 'foo/bar.md');
    const vfile = new VFile({
      path: file,
      value: readFileSync(file, 'utf8')
    });
    const dir = dirname(file);
    const parentDir = dirname(dir);
    const actual = (await processor.process(vfile)).toString();
    assert.equal(actual, `
<h1>Test File</h1>
<h2>Images</h2>
<p>Test image that exists:</p>
<p><img src="${dir}/test-image.jpg" alt="A test image"></p>
<p>Test image that doesn't exist:</p>
<p><img src="./test-image-doesnt-exist.jpg" alt="A test image"></p>
<h2>Links</h2>
<p><a href="${parentDir}/test-link.md">A test link</a> and a <a href="../test-link-doesnt-exist.md">test link that doesn't exist</a>.</p>
<h2>Directives</h2>
<div class="directive HeroImage"><ul>
<li>src: ${dir}/test-image.jpg</li>
<li>alt: A test image</li>
</ul></div>
<div class="directive Failed"><ul>
<li>src: ./test-image-doesnt-exist.jpg</li>
<li>alt: A test image</li>
</ul></div>
`.trim());
  });
});

function find<T>(root: unknown, predicate: Predicate<T>): T | undefined {
  let found: T | undefined;
  visit(root, predicate, function (node) {
    found = node;
    return EXIT;
  });
  return found;
}

function isJsxComponent(name: string) {
  return function (node: unknown): node is MdxJsxFlowElement {
    return isMdxJsxFlowElement(node) && node.name === name;
  }
}

function expandDirectives() {
  return function (tree: unknown) {
    visit(tree, isLeafDirective, function (node) {
      node.data = {
        hProperties: {
          class: `directive ${node.name}`
        }
      };
      const list = { type: 'list', children: ([] as unknown[]) } as List;
      (node.children ??= []).push(list);
      // iterate over the attributes and expand them
      for (const key in node.attributes) {
        list.children.push({
          type: 'listItem',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  value: `${key}: ${node.attributes[key]}`
                }
              ]
            }
          ]
        });
      }
    });
  }
}
