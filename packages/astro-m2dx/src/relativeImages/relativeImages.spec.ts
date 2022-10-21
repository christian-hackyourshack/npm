import { parseMdx } from 'm2dx-utils';
import type { MdxjsEsm, MdxJsxFlowElement } from 'mdast-util-mdx';
import { assert, describe } from 'mintest-green';
import { join } from 'path';
import type { Parent } from 'unist';
import { relativeImages } from './relativeImages';

const fixtures = join(process.cwd(), 'fixtures', 'relativeImages');

export const result = await describe('relativeImages', function (test) {
  test('playground', async function () {
    const input = parseMdx(`
# Relative Images

![Astronaut with vacuum cleaner](test.png "Who needs a title, if we have alt?")

![Astronaut with vacuum cleaner](/assets/astronaut-with-vacuum-cleaner.png)

`);
    await relativeImages(input, fixtures);
    assert.equal(input.children.length, 4);
    assert.equal((input.children[1] as Parent).children[0].type, 'mdxJsxFlowElement');
    assert.equal(
      (input.children[3] as MdxjsEsm).value,
      `import relImg__0 from '${fixtures}/test.png';`
    );
  });

  test('JSX elements', async function () {
    const input = parseMdx(`
# Relative Images

<Quote avatar="./test.png" />

import myImage from './test.png';

<Quote avatar={myImage} />

<img src="./test.png" alt="foo" />

`);
    await relativeImages(input, fixtures);
    assert.equal(input.children.length, 7);
    assert.objectContaining((input.children[1] as MdxJsxFlowElement).attributes[0].value, {
      type: 'mdxJsxAttributeValueExpression',
      value: 'relImg__0',
    });
    assert.objectContaining((input.children[4] as MdxJsxFlowElement).attributes[0].value, {
      type: 'mdxJsxAttributeValueExpression',
      value: 'relImg__1',
    });
    // `import relImg__0 from '${fixtures}/test.png';`
  });
});
