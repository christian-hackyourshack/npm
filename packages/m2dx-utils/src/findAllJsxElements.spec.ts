import { assert, describe } from 'mintest-green';
import { parseMdx } from './parseMdx';
import { findAllJsxElements } from './findAllJsxElements';

await describe('findAllJSXElements', function (test) {
  test('flow element', function () {
    const input = parseMdx(`
<A />
`);
    const found = findAllJsxElements(input);
    assert.deepStrictEqual(
      found.map((n) => n.name),
      ['A']
    );
  });

  test('text element', function () {
    const input = parseMdx(`
<B>Foo</B>
`);
    const found = findAllJsxElements(input);
    assert.deepStrictEqual(
      found.map((n) => n.name),
      ['B']
    );
  });

  test('xhtml element', function () {
    const input = parseMdx(`
<h1>My Title</h1>
`);
    const found = findAllJsxElements(input);
    assert.equal(found.length, 0);
  });

  test('with xhtml element', function () {
    const input = parseMdx(`
<h1>My Title</h1>
`);
    const found = findAllJsxElements(input, true);
    assert.deepStrictEqual(
      found.map((n) => n.name),
      ['h1']
    );
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
    assert.deepStrictEqual(
      found.map((n) => n.name),
      ['A', 'B', 'D', 'A']
    );
  });
});
