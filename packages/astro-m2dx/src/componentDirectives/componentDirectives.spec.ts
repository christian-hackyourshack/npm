import type { MdxJsxFlowElement } from 'mdast-util-mdx';
import { join } from 'path';
import { assert, describe } from 'mintest-green';
import { parseMdx } from 'm2dx-utils';
import { componentDirectives } from './componentDirectives';

const fixtures = join(process.cwd(), 'fixtures', 'componentDirectives');
const files = [join(fixtures, '_directives.ts')];

await describe('componentDirectives', function (test) {
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
    assert.equal(input.children.length, 6);
    assert.objectContaining(input.children[3], {
      type: 'mdxJsxFlowElement',
      name: 'Directives__9840d01ee9ad.quote',
    });
    assert.objectContaining(input.children[4], {
      type: 'mdxJsxFlowElement',
      name: 'Directives__9840d01ee9ad.card',
    });
    assert.objectContaining((input.children[4] as unknown as MdxJsxFlowElement).children[3], {
      type: 'mdxJsxFlowElement',
      name: 'Directives__9840d01ee9ad.call-to-action',
    });
  });

  test('Non-JSX name', async function () {
    const input = parseMdx(`
::call-to-action[Call to **ACTION**]{.text-red type='button'}
`);
    await componentDirectives(input, files);
    assert.equal(input.children.length, 2);
    assert.objectContaining(input.children[0], {
      type: 'mdxJsxFlowElement',
      name: 'Directives__9840d01ee9ad.call-to-action',
    });
  });
});
