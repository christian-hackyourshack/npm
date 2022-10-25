import { isMdxJsxAttribute, isMdxJsxFlowElement, Node, parseMdx } from 'm2dx-utils';
import type { Paragraph } from 'mdast';
import type { MdxjsEsm, MdxJsxFlowElement } from 'mdast-util-mdx';
import { assert, describe } from 'mintest-green';
import { join } from 'path';
import type { Parent } from 'unist';
import { relativeImages } from '.';
import { styleDirectives } from '../styleDirectives';

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

  test('Markdown image with style', async function () {
    const input = parseMdx(`
![Astronaut](test.png):style{.avatar}
`);
    styleDirectives(input);
    await relativeImages(input, fixtures);
    const image = (input.children[0] as Parent).children[0] as MdxJsxFlowElement;
    const classAttribute = image.attributes
      .filter(isMdxJsxAttribute)
      .find((a) => a.name === 'class');
    assert.equal(classAttribute?.value, 'avatar');
  });

  test('With local image component', async function () {
    const input = parseMdx(`
import { Image } from '@components/Image.astro';
export const components = { img: Image };

![Astronaut](test.png)
`);
    await relativeImages(input, fixtures);
    const image = (input.children[1] as Paragraph).children[0] as Node;
    if (isMdxJsxFlowElement(image)) {
      assert.equal(image.name, 'Image');
    } else {
      assert.fail(`Expected an MdxJsxFlowElement but got a '${image.type}'`);
    }
  });

  test('With injected image component', async function () {
    const input = parseMdx(`
![Astronaut](test.png)
`);
    const injected = [
      join(fixtures, '_components-1.ts'),
      join(fixtures, '_components-2.ts'),
      join(fixtures, '_components-3.ts'),
    ];
    await relativeImages(input, fixtures, injected);
    const image = (input.children[0] as Paragraph).children[0] as Node;
    if (isMdxJsxFlowElement(image)) {
      assert.equal(image.name, '_imageComponentFromExportedComponents.img');
    } else {
      assert.fail(`Expected an MdxJsxFlowElement but got a '${image.type}'`);
    }
    const imported = input.children[1] as MdxjsEsm;
    assert.equal(
      imported.value,
      `import { components as _imageComponentFromExportedComponents } from '${fixtures}/_components-3.ts';`
    );
  });
});
