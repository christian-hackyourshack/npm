import { assert, describe } from 'mintest-green';
import { capitalize, toCamelCase } from './cases';

await describe('toCamelCase', function (test) {
  test('no seperator', function () {
    assert.equal(toCamelCase('foobar'), 'foobar');
  });

  test('one seperator', function () {
    assert.equal(toCamelCase('foo-bar'), 'fooBar');
  });

  test('. seperator', function () {
    assert.equal(toCamelCase('foo.bar'), 'fooBar');
  });

  test('_ is no seperator', function () {
    assert.equal(toCamelCase('foo_bar'), 'foo_bar');
  });

  test('two seperators', function () {
    assert.equal(toCamelCase('foo-bar-baz'), 'fooBarBaz');
  });

  test('double seperators', function () {
    assert.equal(toCamelCase('foo--baz'), 'fooBaz');
  });

  test('triple seperators', function () {
    assert.equal(toCamelCase('foo---baz'), 'fooBaz');
  });

  test('empty string', function () {
    assert.equal(toCamelCase(''), '');
  });

  test('capital string', function () {
    assert.equal(toCamelCase('A-b-C'), 'ABC');
  });
});

await describe('capitalize', function (test) {
  test('simple', function () {
    assert.equal(capitalize('foobar'), 'Foobar');
  });

  test('already upper', function () {
    assert.equal(capitalize('Foobar'), 'Foobar');
  });

  test('', function () {
    assert.equal(capitalize(''), '');
  });

  test('special character ß', function () {
    assert.equal(capitalize('ß'), 'SS');
  });

  test('special character ä', function () {
    assert.equal(capitalize('ä'), 'Ä');
  });

  test('smiley', function () {
    assert.equal(capitalize('😀'), '😀');
  });
});
