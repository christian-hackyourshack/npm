import { AssertionError } from 'assert';
import { describe } from './describe';
import { assert } from './index';
import { objectContaining } from './objectContaining';

await describe('objectContaining', function (test) {
  test('accepts equal objects', function () {
    const actual = { type: 'Foo', name: 'Bar' };
    const expected = { type: 'Foo', name: 'Bar' };
    objectContaining(actual, expected);
  });

  test('detects unequal objects', function () {
    const actual = { type: 'Foo', name: 'Bar' };
    const expected = { type: 'Foo', name: 'Baz' };
    assert.throws(() => objectContaining(actual, expected));
  });

  test('accepts partial objects', function () {
    const actual = { type: 'Foo', name: 'Bar', value: 7 };
    const expected = { type: 'Foo', name: 'Bar' };
    objectContaining(actual, expected);
  });

  test('detects incomplete objects', function () {
    const actual = { type: 'Foo', name: 'Bar' };
    const expected = { type: 'Foo', name: 'Bar', value: 7 };
    assert.throws(() => objectContaining(actual, expected));
  });

  test('detects deeply unequal objects', function () {
    const actual = { type: 'Foo', name: { first: 'Joe', last: 'Doe' } };
    const expected = { type: 'Foo', name: { first: 'Jane', last: 'Doe' } };
    try {
      objectContaining(actual, expected);
    } catch (e) {
      if (e instanceof AssertionError) {
        assert.equal(e.message, 'objectContaining is unequal');
        assert.equal(e.operator, '==');
      } else {
        throw e;
      }
    }
  });
});
