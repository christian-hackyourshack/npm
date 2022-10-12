import { assert, describe } from 'mintest-green';
import { isObjectLike } from './ObjectLike';

await describe('isObjectLike', function (test) {
  test('Empty object', function () {
    assert.equal(isObjectLike({}), true);
  });

  test('Normal object', function () {
    assert.equal(isObjectLike({ a: 'Foo' }), true);
  });

  test('Map', function () {
    assert.equal(isObjectLike(new Map()), true);
  });

  test('Record', function () {
    const record: Record<string, string> = { 'a key': 'a value' };
    assert.equal(isObjectLike(record), true);
  });

  test('Array', function () {
    assert.equal(isObjectLike([]), false);
  });

  test('Array', function () {
    assert.equal(isObjectLike([{ a: 'foo' }]), false);
  });

  test('undefined', function () {
    assert.equal(isObjectLike(undefined), false);
  });
});
