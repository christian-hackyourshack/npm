import { describe, expect, test } from 'vitest';
import { parseMdx } from '../utils/mdx';
import { scanTitleAndAbstract } from './index';

describe('scanTitleAndAbstract', function () {
  test('Title only', function () {
    const input = parseMdx(`
# My Title
    `);
    const [title, abstract] = scanTitleAndAbstract(input);
    expect(title).toBe('My Title');
    expect(abstract).toBe(undefined);
  });

  test('Title and Section', function () {
    const input = parseMdx(`
# My Title

## Section
    `);
    const [title, abstract] = scanTitleAndAbstract(input);
    expect(title).toBe('My Title');
    expect(abstract).toBe(undefined);
  });

  test('Title and Abstract', function () {
    const input = parseMdx(`
# My Title

This is the abstract, which
is only one paragraph long.

## Section
    `);
    const [title, abstract] = scanTitleAndAbstract(input);
    expect(title).toBe('My Title');
    expect(abstract).toBe(`This is the abstract, which
is only one paragraph long.`);
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
    expect(title).toBe('My Title');
    expect(abstract).toBe(`This is only the beginning of the abstract.

It is much longer and consists of multiple paragraphs...

Including a JSX Element`);
  });

  test('No Title but an Abstract', function () {
    const input = parseMdx(`
This is the abstract, which
is only one paragraph long.

## Section

`);
    const [title, abstract] = scanTitleAndAbstract(input);
    expect(title).toBe(undefined);
    expect(abstract).toBe(`This is the abstract, which
is only one paragraph long.`);
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
    expect(title).toBe('My Title');
    expect(abstract).toBe(`This is the abstract, which
is only one paragraph long.`);
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
    expect(title).toBe(undefined);
    expect(abstract).toBe(`This is the abstract, which
is only one paragraph long.`);
  });

  test('Title with inline code', function () {
    const input = parseMdx('# My `Title`');
    const [title, abstract] = scanTitleAndAbstract(input);
    expect(title).toBe('My Title');
    expect(abstract).toBe(undefined);
  });

  test('Title with formatting', function () {
    const input = parseMdx(`
# My **Title**

`);
    const [title, abstract] = scanTitleAndAbstract(input);
    expect(title).toBe('My Title');
    expect(abstract).toBe(undefined);
  });
});
