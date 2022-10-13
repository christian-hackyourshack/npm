import { assert, describe } from 'mintest-green';
import { parseMdx } from '../utils/mdx';
import { rehype } from '../utils/rehype/rehype';
import { styleDirectives } from './styleDirectives';

function transformToHTML(input: string) {
  const mdx = parseMdx(input);
  styleDirectives(mdx);
  return rehype(mdx);
}

await describe('styleDirectives', function (test) {
  test('playground', function () {
    const actual = transformToHTML(`
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
</ul>`,
      'Incorrect HTML output'
    );
  });

  test('<li> receives class', function () {
    const actual = transformToHTML(`

- List Item 1
- List Item 2 :style{.foo}

`);
    assert.equal(
      actual,
      `<ul>
<li>List Item 1</li>
<li class="foo">List Item 2 </li>
</ul>`,
      'Incorrect HTML output'
    );
  });

  test('<img> receives class from directly attached style directive', function () {
    const actual = transformToHTML(`

- List Item 1
- ![Alt](/my-img.jpg):style{.foo}

`);
    assert.equal(
      actual,
      `<ul>
<li>List Item 1</li>
<li><img src="/my-img.jpg" alt="Alt" class="foo"></li>
</ul>`,
      'Incorrect HTML output'
    );
  });

  test('<img> does not receive class from distanced style directive', function () {
    const actual = transformToHTML(`

- List Item 1
- ![Alt](/my-img.jpg) :style{.foo}

`);
    assert.equal(
      actual,
      `<ul>
<li>List Item 1</li>
<li class="foo"><img src="/my-img.jpg" alt="Alt"> </li>
</ul>`,
      'Incorrect HTML output'
    );
  });

  test('::list-style does not skip list', function () {
    const actual = transformToHTML(`
::list-style{.foo}

- List Item 1:style{.bar}
- List Item 2 :style{.baz}

`);
    assert.equal(
      actual,
      `<ul class="foo">
<li class="bar">List Item 1</li>
<li class="baz">List Item 2 </li>
</ul>`,
      'Incorrect HTML output'
    );
  });
});
