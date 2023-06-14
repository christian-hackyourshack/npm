import { assert, describe } from 'mintest-green';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import sectionize from '.';

const markdown = `
# Title

Abstract

## Section 1

Paragraph

### Section 1.1

Paragraph

### Section 1.2

Paragraph

## Section 2

#### Wrong Nesting

### Section 2.1

`;

export const result = await describe('remark-sectionize-headings', function (test) {
  test('default', async function () {
    const file = await unified()
      .use(remarkParse)
      .use(sectionize)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(markdown);
    const html = file.value;
    assert.equal(
      html,
      `
    <section class="h1"><h1>Title</h1><p>Abstract</p><section class="h2"><h2>Section 1</h2><p>Paragraph</p><section class="h3"><h3>Section 1.1</h3><p>Paragraph</p></section><section class="h3"><h3>Section 1.2</h3><p>Paragraph</p></section></section><section class="h2"><h2>Section 2</h2><section class="h4"><h4>Wrong Nesting</h4></section><section class="h3"><h3>Section 2.1</h3></section></section></section>
    `.trim(),
      'Incorrect HTML'
    );
  });
  test('levels: [2, 3]', async function () {
    const file = await unified()
      .use(remarkParse)
      .use(sectionize, { levels: [2, 3] })
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(markdown);
    const html = file.value;
    assert.equal(
      html,
      `
<h1>Title</h1>
<p>Abstract</p>
<section class="h2"><h2>Section 1</h2><p>Paragraph</p><section class="h3"><h3>Section 1.1</h3><p>Paragraph</p></section><section class="h3"><h3>Section 1.2</h3><p>Paragraph</p></section></section>
<section class="h2"><h2>Section 2</h2><h4>Wrong Nesting</h4><section class="h3"><h3>Section 2.1</h3></section></section>
`.trim(),
      'Incorrect HTML'
    );
  });
  test('addClass: "section"', async function () {
    const file = await unified()
      .use(remarkParse)
      .use(sectionize, { addClass: "section" })
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(markdown);
    const html = file.value;
    assert.equal(
      html,
      `
<section class="section section--h1"><h1>Title</h1><p>Abstract</p><section class="section section--h2"><h2>Section 1</h2><p>Paragraph</p><section class="section section--h3"><h3>Section 1.1</h3><p>Paragraph</p></section><section class="section section--h3"><h3>Section 1.2</h3><p>Paragraph</p></section></section><section class="section section--h2"><h2>Section 2</h2><section class="section section--h4"><h4>Wrong Nesting</h4></section><section class="section section--h3"><h3>Section 2.1</h3></section></section></section>
`.trim(),
      'Incorrect HTML'
    );
  });
  test('levels: [3], addClass: "subsection"', async function () {
    const file = await unified()
      .use(remarkParse)
      .use(sectionize, { levels: [3], addClass: "subsection" })
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(markdown);
    const html = file.value;
    assert.equal(
      html,
      `
<h1>Title</h1>
<p>Abstract</p>
<h2>Section 1</h2>
<p>Paragraph</p>
<section class="subsection subsection--h3"><h3>Section 1.1</h3><p>Paragraph</p></section>
<section class="subsection subsection--h3"><h3>Section 1.2</h3><p>Paragraph</p></section>
<h2>Section 2</h2>
<h4>Wrong Nesting</h4>
<section class="subsection subsection--h3"><h3>Section 2.1</h3></section>
`.trim(),
      'Incorrect HTML'
    );
  });
});
