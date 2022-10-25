import { lastSegment } from '@internal/utils';
import { assert, describe } from 'mintest-green';

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
