import { parseMdx } from 'm2dx-utils';
import type { MdxJsxFlowElement } from 'mdast-util-mdx';
import { assert, describe } from 'mintest-green';
import { join } from 'path';
import { componentDirectives } from './componentDirectives';

const fixtures = join(process.cwd(), 'fixtures', 'componentDirectives');
const files = [join(fixtures, '_directives.ts')];

export const result = await describe('componentDirectives', function (test) {
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

    const child3 = input.children[3] as MdxJsxFlowElement;
    assert.equal(child3.type, 'mdxJsxFlowElement');
    assert.equal(child3.name!.startsWith('Directives__'), true);
    assert.equal(child3.name!.endsWith('.quote'), true);

    const child4 = input.children[4] as MdxJsxFlowElement;
    assert.equal(child4.type, 'mdxJsxFlowElement');
    assert.equal(child4.name!.startsWith('Directives__'), true);
    assert.equal(child4.name!.endsWith('.card'), true);

    const child43 = child4.children[3] as MdxJsxFlowElement;
    assert.equal(child43.type, 'mdxJsxFlowElement');
    assert.equal(child43.name!.startsWith('Directives__'), true);
    assert.equal(child43.name!.endsWith('.call-to-action'), true);
  });

  test('Non-JSX name', async function () {
    const input = parseMdx(`
::call-to-action[Call to **ACTION**]{.text-red type='button'}
`);
    await componentDirectives(input, files);
    assert.equal(input.children.length, 2);

    const child0 = input.children[0] as MdxJsxFlowElement;
    assert.equal(child0.type, 'mdxJsxFlowElement');
    assert.equal(child0.name!.startsWith('Directives__'), true);
    assert.equal(child0.name!.endsWith('.call-to-action'), true);
  });
});
