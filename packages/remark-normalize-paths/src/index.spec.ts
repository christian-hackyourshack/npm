import { readFileSync } from 'fs';
import { assert, describe } from 'mintest-green';
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
import { dirname } from 'path';

const parser = unified()
  .use(remarkParse)
  .use(remarkDirective)
  .use(remarkMdx);

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
    transform(actual, undefined);

    assert.equal(find(actual, isImage)!.url, `${dir}/picture.jpg`);
    assert.equal(find(actual, isLink)!.url, './all/index.html');
    assert.equal(
      find(actual, isMdxJsxFlowElement('img'))!.attributes.find((a) => isMdxJsxAttribute(a) && a.name === 'src')
        ?.value,
      `${parentDir}/other-picture.png`
    );
    assert.equal(find(actual, isLeafDirective)!.attributes['avatar'], `${dir}/me.jpg`);
    assert.equal(
      find(actual, isMdxJsxFlowElement('CustomComponent'))!.attributes.find(
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
    // const path = resolve(new URL(import.meta.url).pathname, '../../fixtures/foo/bar.md');
    const file = fileURLToPath(new URL('../fixtures/foo/bar.md', import.meta.url));
    const dir = dirname(file);
    const parentDir = dirname(dir);
    const vfile = new VFile({
      path: file,
      value: readFileSync(file, 'utf8')
    });
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
<li>
src: ${dir}/test-image.jpg
</li>
<li>
alt: A test image
</li>
</ul></div>
<div class="directive Failed"><ul>
<li>
src: ./test-image-doesnt-exist.jpg
</li>
<li>
alt: A test image
</li>
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

interface Image {
  type: 'image';
  url: string;
}

function isImage(node: unknown): node is Image {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'image';
}

interface Link {
  type: 'link';
  url: string;
}

function isLink(node: unknown): node is Link {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'link';
}

interface MdxJsxFlowElement {
  type: 'mdxJsxFlowElement';
  name: string;
  attributes: MdxJsxAttribute[];
}

function isMdxJsxFlowElement(name: string) {
  return function (node: unknown): node is MdxJsxFlowElement {
    return (
      typeof node === 'object' &&
      node !== null &&
      'type' in node &&
      node.type === 'mdxJsxFlowElement' &&
      'name' in node &&
      node.name === name
    );
  }
}

interface MdxJsxAttribute {
  type: 'mdxJsxAttribute';
  name: string;
  value: string;
}

function isMdxJsxAttribute(node: unknown): node is MdxJsxAttribute {
  return (
    typeof node === 'object' &&
    node !== null &&
    'type' in node &&
    node.type === 'mdxJsxAttribute'
  );
}

interface LeafDirective {
  type: 'leafDirective';
  name: string;
  attributes: Record<string, string>;
  children?: unknown[];
  data?: Record<string, unknown>;
}

function isLeafDirective(node: unknown): node is LeafDirective {
  return (
    typeof node === 'object' &&
    node !== null &&
    'type' in node &&
    node.type === 'leafDirective'
  );
}

function expandDirectives() {
  return function (tree: unknown) {
    visit(tree, isLeafDirective, function (node) {
      node.data = {
        hProperties: {
          class: `directive ${node.name}`
        }
      };
      const list = { type: 'list', children: ([] as unknown[]) };
      (node.children ??= []).push(list);
      // iterate over the attributes and expand them
      for (const key in node.attributes) {
        list.children.push({
          type: 'listItem',
          children: [
            {
              type: 'text',
              value: `${key}: ${node.attributes[key]}`
            }
          ]
        });
      }
    });
  }
}
