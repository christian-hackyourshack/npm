import { normalizeAll } from '@internal/utils';
import { assert, describe } from 'mintest-green';
import { join } from 'path';

const base = join(process.cwd(), 'base');
export const result = await describe('path', function (test) {
  test('normalizeAll - path-like string', function () {
    const actual = normalizeAll('./foo', base, process.cwd());
    assert.equal(actual, 'base/foo');
  });
  test('normalizeAll - simple string is not normalized', function () {
    const actual = normalizeAll('foo', base, process.cwd());
    assert.equal(actual, 'foo');
  });
  test('normalizeAll - array', function () {
    const actual = normalizeAll(['./foo', '../bar', 'foo'], base, process.cwd());
    assert.deepStrictEqual(actual, ['base/foo', 'bar', 'foo']);
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
      images: ['base/img1.jpg', 'base/img2.jpg'],
      metaData: {
        href: 'foo/bar/index.html',
      },
      relative: 'base/foo/bar',
    };
    const actual = normalizeAll(input, base, process.cwd());
    assert.deepStrictEqual(actual, expected);
  });
  test('normalizeAll - array without change', function () {
    const input = ['foo', 'bar'];
    const actual = normalizeAll(input, base, process.cwd());
    assert.strictEqual(actual, input);
  });
});
