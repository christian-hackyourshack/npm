import type { Paragraph } from 'mdast';
import { assert, describe } from 'mintest-green';
import type { LeafDirective } from './mdast';
import { parseMdx } from './parseMdx';

export const result = await describe('parseMdx', function (test) {
  test('empty', function () {
    const actual = parseMdx(``);
    assert.equal(actual.type, 'root');
    assert.equal(actual.children.length, 0);
  });

  test('playground', function () {
    const actual = parseMdx(`
import { value } from 'values';
export const double = value + value;

# Finally, the Title

A paragraph to start with...
`);
    assert.equal(actual.type, 'root');
    assert.equal(actual.children.length, 3);
  });

  test('with directives', function () {
    const actual = parseMdx(`
# The Title

::note[A note]

::style{.bg-accent .rounded-top}

A paragraph to start with...:style{.text-red}

`);
    assert.equal(actual.children.length, 4);
    assert.equal(actual.children[1].type, 'leafDirective');
    assert.equal(actual.children[2].type, 'leafDirective');
    assert.equal((actual.children[2] as LeafDirective).attributes.class, 'bg-accent rounded-top');
    assert.equal((actual.children[3] as Paragraph).children[1].type, 'textDirective');
  });
});
