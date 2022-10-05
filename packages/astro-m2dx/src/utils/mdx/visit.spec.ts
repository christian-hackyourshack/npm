import { describe, expect, test } from 'vitest';
import { parseMdx } from './parseMdx';
import { EXIT, SKIP, visit } from './visit';

const input = parseMdx(`
# Title

One paragraph.

![An image](./image.png)

## Heading

Another One.

`);

describe('visit', function () {
  test('all', async function () {
    const elements = [];
    visit(input, (node) => {
      elements.push(`${node.type}`);
    });

    expect(elements.length).toBe(11);
  });

  test('EXIT after first paragraph', async function () {
    const elements = [];
    visit(input, (node) => {
      elements.push(`${node.type}`);
      if (node.type === 'paragraph') {
        return EXIT;
      }
    });

    expect(elements.length).toBe(4);
  });

  test('SKIP paragraph content', async function () {
    const elements = [];
    visit(input, (node) => {
      elements.push(`${node.type}`);
      if (node.type === 'paragraph') {
        return SKIP;
      }
    });

    expect(elements.length).toBe(8);
  });
});
