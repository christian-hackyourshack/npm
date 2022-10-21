import { assert, describe } from 'mintest-green';
import { parseMdx } from './parseMdx';
import { EXIT, SKIP, visit } from './visit';

const input = parseMdx(`
# Title

One paragraph.

![An image](./image.png)

## Heading

Another One.

`);

export const result = await describe('visit', function (test) {
  test('all', async function () {
    const elements: string[] = [];
    visit(input, (node) => {
      elements.push(`${node.type}`);
    });

    assert.equal(elements.length, 11);
  });

  test('EXIT after first paragraph', async function () {
    const elements: string[] = [];
    visit(input, (node) => {
      elements.push(`${node.type}`);
      if (node.type === 'paragraph') {
        return EXIT;
      }
    });

    assert.equal(elements.length, 4);
  });

  test('SKIP paragraph content', async function () {
    const elements: string[] = [];
    visit(input, (node) => {
      elements.push(`${node.type}`);
      if (node.type === 'paragraph') {
        return SKIP;
      }
    });

    assert.equal(elements.length, 8);
  });
});
