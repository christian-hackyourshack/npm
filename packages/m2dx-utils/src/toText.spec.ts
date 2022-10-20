import { assert, describe } from 'mintest-green';
import { parseMdx } from './parseMdx';
import { toText } from './toText';

describe('toText', function (test) {
  test('empty', function () {
    const input = parseMdx(``);
    const actual = toText(input);
    assert.equal(actual, '');
  });

  test('heading', function () {
    const input = parseMdx(`# Heading`);
    const actual = toText(input);
    assert.equal(actual, 'Heading');
  });

  test('multiple paragraphs', function () {
    const input = parseMdx(`# Heading

Some text. And more text.

Next paragraph.
`);
    const actual = toText(input);
    assert.equal(actual, 'Heading Some text. And more text. Next paragraph.');
  });

  test('multiple paragraphs with linefeed', function () {
    const input = parseMdx(`# Heading

Some text. And more text.

Next paragraph.
`);
    const actual = toText(input, '\n');
    assert.equal(
      actual,
      `Heading
Some text. And more text.
Next paragraph.`
    );
  });
});
