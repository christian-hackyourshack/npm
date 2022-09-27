import { describe, expect, test } from 'vitest';
import { parseMdx } from '../utils/mdx';

describe('directives', function () {
  test('simple container directive', function () {
    const input = parseMdx(`
# Astro Docs

Paragraph 1.

:::note
Callout block!
:::

Paragraph 2.
`);
    expect(input.children.length).toBe(4);
  });
});
