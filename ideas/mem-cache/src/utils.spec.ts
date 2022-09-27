import { describe, expect, test } from 'vitest';
import { capitalize, lastSegment, toCamelCase } from './utils';

describe('toCamelCase', function () {
  test('no seperator', function () {
    expect(toCamelCase('foobar')).toEqual('foobar');
  });

  test('one seperator', function () {
    expect(toCamelCase('foo-bar')).toEqual('fooBar');
  });

  test('two seperators', function () {
    expect(toCamelCase('foo-bar-baz')).toEqual('fooBarBaz');
  });

  test('double seperators', function () {
    expect(toCamelCase('foo--baz')).toEqual('fooBaz');
  });

  test('triple seperators', function () {
    expect(toCamelCase('foo---baz')).toEqual('fooBaz');
  });

  test('empty string', function () {
    expect(toCamelCase('')).toEqual('');
  });

  test('capital string', function () {
    expect(toCamelCase('A-b-C')).toEqual('ABC');
  });
});

describe('capitalize', function () {
  test('simple', function () {
    expect(capitalize('foobar')).toEqual('Foobar');
  });

  test('already upper', function () {
    expect(capitalize('Foobar')).toEqual('Foobar');
  });

  test('', function () {
    expect(capitalize('')).toEqual('');
  });

  test('special character ß', function () {
    expect(capitalize('ß')).toEqual('SS');
  });

  test('special character ä', function () {
    expect(capitalize('ä')).toEqual('Ä');
  });

  test('smiley', function () {
    expect(capitalize('😀')).toEqual('😀');
  });
});

describe('split', function () {
  test('no seperator', function () {
    expect(lastSegment('foobar')).toEqual('foobar');
  });

  test('one seperator', function () {
    expect(lastSegment('foo/bar')).toEqual('bar');
  });

  test('two seperators', function () {
    expect(lastSegment('foo/bar/baz')).toEqual('baz');
  });

  test('duplicate seperators', function () {
    expect(lastSegment('foo/bar//baz')).toEqual('baz');
  });
});
