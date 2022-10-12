import { assert } from './assert';
import { describe } from './describe';

await describe('assert', function (test) {
  test('objectContaining accepts equal objects', function () {
    const actual = { type: 'Foo', name: 'Bar' };
    const expected = { type: 'Foo', name: 'Bar' };
    assert.objectContaining(actual, expected);
  });

  test('objectContaining detects unequal objects', function () {
    const actual = { type: 'Foo', name: 'Bar' };
    const expected = { type: 'Foo', name: 'Baz' };
    assert.throws(() => assert.objectContaining(actual, expected));
  });

  test('objectContaining accepts partial objects', function () {
    const actual = { type: 'Foo', name: 'Bar', value: 7 };
    const expected = { type: 'Foo', name: 'Bar' };
    assert.objectContaining(actual, expected);
  });

  test('objectContaining detects incomplete objects', function () {
    const actual = { type: 'Foo', name: 'Bar' };
    const expected = { type: 'Foo', name: 'Bar', value: 7 };
    assert.throws(() => assert.objectContaining(actual, expected));
  });
});
