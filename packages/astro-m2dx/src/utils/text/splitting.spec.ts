import { describe, expect, test } from 'vitest';
import { lastSegment } from './splitting';

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
