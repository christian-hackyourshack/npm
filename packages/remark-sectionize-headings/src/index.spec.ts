import { assert, describe } from 'mintest-green';
import { sectionize } from '.';
import { rehype, remark } from './utils';

export const result = await describe('remark-sectionize-headings', function (test) {
  test('levels [2, 3]', function () {
    const input = remark(`
# Title

Abstract

## Section 1

Paragraph

### Section 1.1

Paragraph

### Section 1.2

Paragraph

## Section 2

Paragraph

### Section 2.1

`);
    sectionize(input, { levels: [2, 3] });
    const html = rehype(input);

    assert.equal(
      html,
      `<h1>Title</h1>
<p>Abstract</p>
<section class="h2"><h2>Section 1</h2><p>Paragraph</p><section class="h3"><h3>Section 1.1</h3><p>Paragraph</p></section><section class="h3"><h3>Section 1.2</h3><p>Paragraph</p></section></section>
<section class="h2"><h2>Section 2</h2><p>Paragraph</p><section class="h3"><h3>Section 2.1</h3></section></section>`,
      'Incorrect HTML'
    );
  });
});
