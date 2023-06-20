import { assert, describe } from 'mintest-green';
import rehypeStringify from 'rehype-stringify';
import remarkDirective from 'remark-directive';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import classDirective from '.';

const processor = unified()
  .use(remarkParse)
  .use(remarkDirective)
  .use(classDirective)
  .use(remarkRehype)
  .use(rehypeStringify);

export const result = await describe('remark-class-directive', function (test) {
  test('playground', async function () {
    const actual = await processor.process(`
# Astro Docs

::other-directive

Paragraph 1 with **:class{.text-red}strong emphasis**.

:::class{.bg-accent}

## Chapter 1

::class{.decent}

A lot of text here.

:::

::list-class{.nav}

- Home
- Blog
- Docs


`);
    assert.equal(
      actual.value,
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

  test('<li> receives class', async function () {
    const actual = await processor.process(`

- List Item 1
- List Item 2 :class{.foo}

`);
    assert.equal(
      actual.value,
      `<ul>
<li>List Item 1</li>
<li class="foo">List Item 2 </li>
</ul>`,
      'Incorrect HTML output'
    );
  });

  test('<img> receives class from directly attached style directive', async function () {
    const actual = await processor.process(`

- List Item 1
- ![Alt](/my-img.jpg):class{.foo}

`);
    assert.equal(
      actual.value,
      `<ul>
<li>List Item 1</li>
<li><img src="/my-img.jpg" alt="Alt" class="foo"></li>
</ul>`,
      'Incorrect HTML output'
    );
  });

  test('<img> does not receive class from distanced style directive', async function () {
    const actual = await processor.process(`

- List Item 1
- ![Alt](/my-img.jpg) :class{.foo}

`);
    assert.equal(
      actual.value,
      `<ul>
<li>List Item 1</li>
<li class="foo"><img src="/my-img.jpg" alt="Alt"> </li>
</ul>`,
      'Incorrect HTML output'
    );
  });

  test('<a> receives class from directly attached style directive', async function () {
    const actual = await processor.process(`
Just some inline style.:class{.bar}

[Visit Berlin](/berlin-tour):class{.foo}

`);
    assert.equal(
      actual.value,
      `<p class="bar">Just some inline style.</p>
<p><a href="/berlin-tour" class="foo">Visit Berlin</a></p>`,
      'Incorrect HTML output'
    );
  });

  test('::list-class does not skip list', async function () {
    const actual = await processor.process(`
::list-class{.foo}

- List Item 1:class{.bar}
- List Item 2 :class{.baz}

`);
    assert.equal(
      actual.value,
      `<ul class="foo">
<li class="bar">List Item 1</li>
<li class="baz">List Item 2 </li>
</ul>`,
      'Incorrect HTML output'
    );
  });

  test('Second ::list-class is applied, too', async function () {
    const actual = await processor.process(`

::list-class{.bar}

- foo

::list-class{.foo}

- bar

`);
    assert.equal(
      actual.value,
      `<ul class="bar">
<li>foo</li>
</ul>
<ul class="foo">
<li>bar</li>
</ul>`,
      'Incorrect HTML output'
    );
  });

  test('Leaf directive with content', async function () {
    const actual = await processor.process(`
::class[Astro]{.text-gradient}
`);
    assert.equal(actual, `<div class="text-gradient">Astro</div>`, 'Incorrect HTML output');
  });

  test('Text directive with content', async function () {
    const actual = await processor.process(`
# Welcome to :class[Astro]{.text-gradient}
`);
    assert.equal(
      actual.value,
      `<h1>Welcome to <span class="text-gradient">Astro</span></h1>`,
      'Incorrect HTML output'
    );
  });

  test('Configured processor: different name', async function () {
    const processor = unified()
      .use(remarkParse)
      .use(remarkDirective)
      .use(classDirective, { name: 'style' })
      .use(remarkRehype)
      .use(rehypeStringify);

    const actual = await processor.process(`
# Welcome to :style[Astro]{.text-gradient}

::list-style{.nav}

- foo
- bar :style{.baz}
`);
    assert.equal(
      actual.value,
      `
<h1>Welcome to <span class="text-gradient">Astro</span></h1>
<ul class="nav">
<li>foo</li>
<li class="baz">bar </li>
</ul>
`.trim(),
      'Incorrect HTML output'
    );
  });
});
