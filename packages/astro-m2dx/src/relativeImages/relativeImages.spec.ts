import { Parent } from 'unist';
import { describe, expect, test } from 'vitest';
import { MdxjsEsm, parseMdx } from '../utils/mdx';
import { relativeImages } from './relativeImages';

describe('mdx', function () {
  test('findUnresolved', async function () {
    const input = parseMdx(`
# Relative Images

![Astronaut with vacuum cleaner](astronaut-with-vacuum-cleaner.png "Who needs a title, if we have alt?")

![Astronaut with vacuum cleaner](/assets/astronaut-with-vacuum-cleaner.png)

`);
    await relativeImages(input);
    expect(input.children.length).toBe(4);
    expect((input.children[1] as Parent).children[0].type).toBe('mdxJsxFlowElement');
    expect((input.children[3] as MdxjsEsm).value).toBe(
      "import relImg__0 from './astronaut-with-vacuum-cleaner.png';"
    );
  });
});
