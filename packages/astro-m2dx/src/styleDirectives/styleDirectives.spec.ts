import { assert, describe } from 'mintest-green';
import { parseMdx } from '../utils/mdx';
import { rehype } from '../utils/rehype/rehype';
import { styleDirectives } from './styleDirectives';

await describe('styleDirectives', function (test) {
  test('playground', function () {
    const input = parseMdx(`
# Astro Docs

::other-directive

Paragraph 1 with **:style{.text-red}strong emphasis**.

:::style{.bg-accent}

## Chapter 1

::style{.decent}

A lot of text here.

:::

::list-style{.nav}

- Home
- Blog
- Docs


`);
    styleDirectives(input);
    const actual = rehype(input);
    assert.equal(
      actual,
      `<h1>Astro Docs</h1>
<div></div>
<p>Paragraph 1 with <strong class="text-red">strong emphasis</strong>.</p>
<div class="bg-accent decent"><h2>Chapter 1</h2><p>A lot of text here.</p></div>
<ul class="nav">
<li>Home</li>
<li>Blog</li>
<li>Docs</li>
</ul>`
    );
  });
});
