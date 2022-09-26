import { describe, expect, test } from 'vitest';
import { parseMdx } from './parseMdx';
import { findAllJsxElements } from './findAllJsxElements';

describe('findAllJSXElements', function () {
  test('flow element', function () {
    const input = parseMdx(`
<A />
`);
    const found = findAllJsxElements(input);
    expect(found.map((n) => n.name)).toStrictEqual(['A']);
  });

  test('text element', function () {
    const input = parseMdx(`
<B>Foo</B>
`);
    const found = findAllJsxElements(input);
    expect(found.map((n) => n.name)).toStrictEqual(['B']);
  });

  test('xhtml element', function () {
    const input = parseMdx(`
<h1>My Title</h1>
`);
    const found = findAllJsxElements(input);
    expect(found.length).toBe(0);
  });

  test('with xhtml element', function () {
    const input = parseMdx(`
<h1>My Title</h1>
`);
    const found = findAllJsxElements(input, true);
    expect(found.map((n) => n.name)).toStrictEqual(['h1']);
  });

  test('with context', function () {
    const input = parseMdx(`
import {A, B} from 'c';
import D from 'd';

<A />
<B>
  Foo
  <D />
</B>

<A>bar</A>;

<h1>My Title</h1>

`);
    const found = findAllJsxElements(input);
    expect(found.map((n) => n.name)).toStrictEqual(['A', 'B', 'D', 'A']);
  });
});
