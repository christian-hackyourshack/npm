# mintest-green

Fully typed minimalistic test-runner.

Heavily inspired by [baretest](https://github.com/volument/baretest).

## Content

- [Content](#content)
- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)

## What is this?

This package is a minimalistic and blazing fast test-runner, completely written in TypeScript.

## When should I use this?

If the startup time of Jest bothers you and the notation and lack of types in baretest bothers you, too.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with `npm`:

```sh
npm install mintest-green
```

## Use

```js
import assert from 'assert';
import { describe } from './mintest';

let count = 0;
function incr() {
  count++;
}

await describe('mintest', function (test) {
  test.beforeEach(incr);

  test('Foo', function () {
    assert.equal(2 + 2, 4);
  });
  test('Bar', function () {
    assert.equal(2 + 2, 4, 'Oh no!');
  });
  test.skip('Baz', function () {
    assert.equal(2 + 2, 5, 'This does not matter');
  });
});

assert.equal(count, 2);
```

`describe` is an async function in which you can describe your unit under test. Use the test util and its sub-features to do that.

This is still in very early alpha, use at your own risk.
