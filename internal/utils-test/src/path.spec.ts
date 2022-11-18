import { normalizeAll } from '@internal/utils';
import { assert, describe } from 'mintest-green';

const base = '/root/base';
export const result = await describe('path', function (test) {
  test('normalizeAll - path-like string', function () {
    const actual = normalizeAll('./foo', base);
    assert.equal(actual, '/root/base/foo');
  });
  test('normalizeAll - simple string is not normalized', function () {
    const actual = normalizeAll('foo', base);
    assert.equal(actual, 'foo');
  });
  test('normalizeAll - array', function () {
    const actual = normalizeAll(['./foo', '../bar', 'foo'], base);
    assert.deepStrictEqual(actual, ['/root/base/foo', '/root/bar', 'foo']);
  });
  test('normalizeAll - object', function () {
    const input = {
      images: ['./img1.jpg', './img2.jpg'],
      metaData: {
        href: '../foo/bar/index.html',
      },
      absolute: '/foo/bar/',
      relative: './foo/bar/',
    };
    const expected = {
      absolute: '/foo/bar/',
      images: ['/root/base/img1.jpg', '/root/base/img2.jpg'],
      metaData: {
        href: '/root/foo/bar/index.html',
      },
      relative: '/root/base/foo/bar/',
    };
    const actual = normalizeAll(input, base);
    assert.deepStrictEqual(actual, expected);
  });
  test('normalizeAll - array without change', function () {
    const input = ['foo', 'bar'];
    const actual = normalizeAll(input, base);
    assert.strictEqual(actual, input);
  });
});
