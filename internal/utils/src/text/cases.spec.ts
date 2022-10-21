import { assert, describe } from 'mintest-green';
import { capitalize, toCamelCase } from './cases';

export const result = await describe('cases', function (test) {
  test('toCamelCase: no seperator', function () {
    assert.equal(toCamelCase('foobar'), 'foobar');
  });

  test('toCamelCase: one seperator', function () {
    assert.equal(toCamelCase('foo-bar'), 'fooBar');
  });

  test('toCamelCase: . seperator', function () {
    assert.equal(toCamelCase('foo.bar'), 'fooBar');
  });

  test('toCamelCase: _ is no seperator', function () {
    assert.equal(toCamelCase('foo_bar'), 'foo_bar');
  });

  test('toCamelCase: two seperators', function () {
    assert.equal(toCamelCase('foo-bar-baz'), 'fooBarBaz');
  });

  test('toCamelCase: double seperators', function () {
    assert.equal(toCamelCase('foo--baz'), 'fooBaz');
  });

  test('toCamelCase: triple seperators', function () {
    assert.equal(toCamelCase('foo---baz'), 'fooBaz');
  });

  test('toCamelCase: empty string', function () {
    assert.equal(toCamelCase(''), '');
  });

  test('toCamelCase: capital string', function () {
    assert.equal(toCamelCase('A-b-C'), 'ABC');
  });

  test('capitalize: simple', function () {
    assert.equal(capitalize('foobar'), 'Foobar');
  });

  test('capitalize: already upper', function () {
    assert.equal(capitalize('Foobar'), 'Foobar');
  });

  test('capitalize: ', function () {
    assert.equal(capitalize(''), '');
  });

  test('capitalize: special character ß', function () {
    assert.equal(capitalize('ß'), 'SS');
  });

  test('capitalize: special character ä', function () {
    assert.equal(capitalize('ä'), 'Ä');
  });

  test('capitalize: smiley', function () {
    assert.equal(capitalize('😀'), '😀');
  });
});
