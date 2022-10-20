import { assert, describe } from 'mintest-green';
import { parseMdx } from 'm2dx-utils';
import { scanTitleAndAbstract } from './index';

await describe('scanTitleAndAbstract', function (test) {
  test('Title only', function () {
    const input = parseMdx(`
# My Title
    `);
    const [title, abstract] = scanTitleAndAbstract(input);
    assert.equal(title, 'My Title');
    assert.equal(abstract, undefined);
  });

  test('Title and Section', function () {
    const input = parseMdx(`
# My Title

## Section
    `);
    const [title, abstract] = scanTitleAndAbstract(input);
    assert.equal(title, 'My Title');
    assert.equal(abstract, undefined);
  });

  test('Title and Abstract', function () {
    const input = parseMdx(`
# My Title

This is the abstract, which
is only one paragraph long.

## Section
    `);
    const [title, abstract] = scanTitleAndAbstract(input);
    assert.equal(title, 'My Title');
    assert.equal(
      abstract,
      `This is the abstract, which
is only one paragraph long.`
    );
  });

  test('Title and Long Abstract', function () {
    const input = parseMdx(`
# My Title

This is only the beginning of the abstract.

It is much longer and consists of multiple paragraphs...

<Claim>Including a JSX Element</Claim>

## Section

`);
    const [title, abstract] = scanTitleAndAbstract(input);
    assert.equal(title, 'My Title');
    assert.equal(
      abstract,
      `This is only the beginning of the abstract.

It is much longer and consists of multiple paragraphs...

Including a JSX Element`
    );
  });

  test('No Title but an Abstract', function () {
    const input = parseMdx(`
This is the abstract, which
is only one paragraph long.

## Section

`);
    const [title, abstract] = scanTitleAndAbstract(input);
    assert.equal(title, undefined);
    assert.equal(
      abstract,
      `This is the abstract, which
is only one paragraph long.`
    );
  });

  test('Late Title and Abstract', function () {
    const input = parseMdx(`
Some strange preface paragraph.

# My Title

This is the abstract, which
is only one paragraph long.

## Section

`);
    const [title, abstract] = scanTitleAndAbstract(input);
    assert.equal(title, 'My Title');
    assert.equal(
      abstract,
      `This is the abstract, which
is only one paragraph long.`
    );
  });

  test('Late Title and Abstract, no scanTitle', function () {
    const input = parseMdx(`
Some strange preface paragraph.

# My Title

This is the abstract, which
is only one paragraph long.

## Section

`);
    const [title, abstract] = scanTitleAndAbstract(input, false);
    assert.equal(title, undefined);
    assert.equal(
      abstract,
      `This is the abstract, which
is only one paragraph long.`
    );
  });

  test('Title with inline code', function () {
    const input = parseMdx('# My `Title`');
    const [title, abstract] = scanTitleAndAbstract(input);
    assert.equal(title, 'My Title');
    assert.equal(abstract, undefined);
  });

  test('Title with formatting', function () {
    const input = parseMdx(`
# My **Title**

`);
    const [title, abstract] = scanTitleAndAbstract(input);
    assert.equal(title, 'My Title');
    assert.equal(abstract, undefined);
  });
});
