import type { MdxJsxFlowElement } from 'mdast-util-mdx';
import { join } from 'path';
import { describe, expect, test } from 'vitest';
import { parseMdx } from '../utils/mdx';
import { componentDirectives } from './componentDirectives';

const fixtures = join(process.cwd(), 'fixtures', 'componentDirectives');
const files = [join(fixtures, '_directives.ts')];

describe('componentDirectives', function () {
  test('playground', async function () {
    const input = parseMdx(`
# Component Directives Playground

You could use them inline, to embed your :logo

You could introduce a component for fancy quotes:

::quote[Markdown with **Magic MDX** can be so fancy!]{author="Kaya" from="Berlin" img="./kaya.jpg"}

:::card{#demo-card .bg-accent}

## Cards are nice

You could do a lot of layout stuff in your MDX, but...

the question remains, wheter you _should_

::call-to-action[You should **NOT**]{color='red'}

:::

`);
    await componentDirectives(input, files);
    expect(input.children.length).toBe(6);
    expect(input.children[3]).toEqual(
      expect.objectContaining({
        type: 'mdxJsxFlowElement',
        name: 'Directives__22ca94e3f2c2.quote',
      })
    );
    expect(input.children[4]).toEqual(
      expect.objectContaining({
        type: 'mdxJsxFlowElement',
        name: 'Directives__22ca94e3f2c2.card',
      })
    );
    expect((input.children[4] as MdxJsxFlowElement).children[3]).toEqual(
      expect.objectContaining({
        type: 'mdxJsxFlowElement',
        name: 'Directives__22ca94e3f2c2.call-to-action',
      })
    );
  });

  test('Non-JSX name', async function () {
    const input = parseMdx(`
::call-to-action[Call to **ACTION**]{.text-red type='button'}
`);
    await componentDirectives(input, files);
    expect(input.children.length).toBe(2);
    expect(input.children[0]).toEqual(
      expect.objectContaining({
        type: 'mdxJsxFlowElement',
        name: 'Directives__22ca94e3f2c2.call-to-action',
      })
    );
  });
});
