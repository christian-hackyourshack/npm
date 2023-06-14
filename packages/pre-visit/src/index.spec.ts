import { assert, describe } from 'mintest-green';
import { EXIT, SKIP, visit } from '.';

interface Node extends Record<string, unknown> {
  type: string;
  children?: Node[];
}

function isNode(node: unknown): node is Node {
  return (Object.keys(node as Node).includes('type'))
}

const input: Node = {
  type: "root",
  children: [
    {
      type: "heading",
      children: [{ type: "text", value: "Section 1" }]
    },
    {
      type: "paragraph",
      children: [{ type: "text", value: "First paragraph" }]
    },
    {
      type: "paragraph",
      children: [{ type: "text", value: "Second paragraph" }]
    },
    {
      type: "heading",
      children: [{ type: "text", value: "Section 2" }]
    },
    {
      type: "paragraph",
      children: [{ type: "text", value: "Third paragraph" }]
    },
  ]
};

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
