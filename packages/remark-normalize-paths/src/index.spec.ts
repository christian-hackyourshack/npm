import { assert, describe } from 'mintest-green';
import { EXIT, Predicate, visit } from 'pre-visit';
import remarkDirective from 'remark-directive';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import remarkNormalizePaths from '.';

const parser = unified()
  .use(remarkParse)
  .use(remarkDirective)
  .use(remarkMdx)
  .use(remarkNormalizePaths, { exclude: ["link", "<CustomComponent>"] });

export const result = await describe('remark-normalize-paths', function (test) {
  test('playground', async function () {
    const input = parser.parse(`
![](./picture.jpg)

[Read more](./all/index.html)

<img src="../other-picture.png" />

::Quote[MDX is great]{author="Me" avatar="./me.jpg" .xxl}

<CustomComponent ref="./input.txt" />

`);
    const transform = remarkNormalizePaths({ exclude: ["link", "<CustomComponent>"] });
    const actual = transform(input, undefined);

    assert.equal(find(actual, isImage)!.url, '/workspaces/npm/packages/remark-normalize-paths/picture.jpg');
    assert.equal(find(actual, isLink)!.url, './all/index.html');
    assert.equal(
      find(actual, isMdxJsxFlowElement('img'))!.attributes.find((a) => isMdxJsxAttribute(a) && a.name === 'src')
        ?.value,
      '/workspaces/npm/packages/other-picture.png'
    );
    assert.equal(find(actual, isLeafDirective)!.attributes['avatar'], '/workspaces/npm/packages/remark-normalize-paths/me.jpg');
    assert.equal(
      find(actual, isMdxJsxFlowElement('CustomComponent'))!.attributes.find(
        (a) => isMdxJsxAttribute(a) && a.name === 'ref'
      )?.value,
      './input.txt'
    );
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
}

function isLeafDirective(node: unknown): node is LeafDirective {
  return (
    typeof node === 'object' &&
    node !== null &&
    'type' in node &&
    node.type === 'leafDirective'
  );
}
