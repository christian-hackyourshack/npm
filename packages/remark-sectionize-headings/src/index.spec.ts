import { toHtml } from 'hast-util-to-html';
import type { Root } from 'mdast';
import { toHast } from 'mdast-util-to-hast';
import { assert, describe } from 'mintest-green';
import { remark as parser } from 'remark';
import plugin from '.';

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
  test('default', function () {
    const sectionize = plugin();
    const input = remark(markdown);
    sectionize(input);
    const html = rehype(input);
    assert.equal(
      html,
      `
<section class="h1"><h1>Title</h1><p>Abstract</p><section class="h2"><h2>Section 1</h2><p>Paragraph</p><section class="h3"><h3>Section 1.1</h3><p>Paragraph</p></section><section class="h3"><h3>Section 1.2</h3><p>Paragraph</p></section></section><section class="h2"><h2>Section 2</h2><section class="h4"><h4>Wrong Nesting</h4></section><section class="h3"><h3>Section 2.1</h3></section></section></section>
`.trim(),
      'Incorrect HTML'
    );
  });
  test('levels: [2, 3]', function () {
    const sectionize = plugin({ levels: [2, 3] });
    const input = remark(markdown);
    sectionize(input);
    const html = rehype(input);
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
  test('addClass: "section"', function () {
    const sectionize = plugin({ addClass: "section" });
    const input = remark(markdown);
    sectionize(input);
    const html = rehype(input);
    assert.equal(
      html,
      `
<section class="section section--h1"><h1>Title</h1><p>Abstract</p><section class="section section--h2"><h2>Section 1</h2><p>Paragraph</p><section class="section section--h3"><h3>Section 1.1</h3><p>Paragraph</p></section><section class="section section--h3"><h3>Section 1.2</h3><p>Paragraph</p></section></section><section class="section section--h2"><h2>Section 2</h2><section class="section section--h4"><h4>Wrong Nesting</h4></section><section class="section section--h3"><h3>Section 2.1</h3></section></section></section>
`.trim(),
      'Incorrect HTML'
    );
  });
  test('levels: [3], addClass: "subsection"', function () {
    const sectionize = plugin({ levels: [3], addClass: "subsection" });
    const input = remark(markdown);
    sectionize(input);
    const html = rehype(input);
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

export function remark(md: string): Root {
  return parser().parse(md);
}

export function rehype(root: Root): string {
  const hast = toHast(root, { allowDangerousHtml: true });
  const html = toHtml(hast!, { allowDangerousHtml: true });
  return html;
}
