import { assert, describe } from 'mintest-green';
import { lastSegment } from './splitting';

export const result = await describe('split', function (test) {
  test('no seperator', function () {
    assert.equal(lastSegment('foobar'), 'foobar');
  });

  test('one seperator', function () {
    assert.equal(lastSegment('foo/bar'), 'bar');
  });

  test('two seperators', function () {
    assert.equal(lastSegment('foo/bar/baz'), 'baz');
  });

  test('duplicate seperators', function () {
    assert.equal(lastSegment('foo/bar//baz'), 'baz');
  });
});
