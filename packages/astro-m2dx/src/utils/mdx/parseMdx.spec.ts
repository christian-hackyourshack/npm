import type { Paragraph } from 'mdast';
import { describe, expect, test } from 'vitest';
import type { LeafDirective } from './mdast';
import { parseMdx } from './parseMdx';

describe('parseMdx', function () {
  test('empty', function () {
    const actual = parseMdx(``);
    expect(actual.type).toBe('root');
    expect(actual.children.length).toBe(0);
  });

  test('playground', function () {
    const actual = parseMdx(`
import { value } from 'values';
export const double = value + value;

# Finally, the Title

A paragraph to start with...
`);
    expect(actual.type).toBe('root');
    expect(actual.children.length).toBe(3);
  });

  test('with directives', function () {
    const actual = parseMdx(`
# The Title

::note[A note]

::style{.bg-accent .rounded-top}

A paragraph to start with...:style{.text-red}

`);
    expect(actual.children.length).toBe(4);
    expect(actual.children[1].type).toBe('leafDirective');
    expect(actual.children[2].type).toBe('leafDirective');
    expect((actual.children[2] as LeafDirective).attributes.class).toBe('bg-accent rounded-top');
    expect((actual.children[3] as Paragraph).children[1].type).toBe('textDirective');
  });
});
