import { deepMerge } from '@internal/utils';
import { assert, describe } from 'mintest-green';

export const result = await describe('deepMerge', function (test) {
  test('deepMerge adds simple values', function () {
    const a = {
      a: 'A String',
    };
    const b = {
      b: 42,
    };
    const actual = deepMerge(a, b);
    const expected = {
      a: 'A String',
      b: 42,
    };
    assert.deepStrictEqual(actual, expected);
  });

  test('deepMerge does overwrite simple values', function () {
    const a = {
      a: 'A String',
      b: 'Beware',
    };
    const b = {
      b: 42,
    };
    const actual = deepMerge(a, b);
    const expected = {
      a: 'A String',
      b: 42,
    };
    assert.deepStrictEqual(actual, expected);
  });

  test('deepMerge adds deep', function () {
    const a = {
      a: 'A String',
      b: {
        a: 'A deep string',
      },
    };
    const b = {
      b: {
        b: 42,
      },
    };
    const actual = deepMerge(a, b);
    const expected = {
      a: 'A String',
      b: {
        a: 'A deep string',
        b: 42,
      },
    };
    assert.deepStrictEqual(actual, expected);
  });

  test('deepMerge handles Dates', function () {
    const aDate = new Date('2022-01-01');
    const bDate = new Date('2022-02-01');
    const a = {
      a: aDate,
    };
    const b = {
      a: bDate,
    };
    const actual = deepMerge(a, b);
    assert.equal(actual.a, bDate);
  });

  test('target is unchanged', function () {
    const target = {
      a: 'A',
      b: {
        c: 'C',
      },
    };
    const source = {
      b: {
        c: 'Not C',
      },
    };
    const actual = deepMerge(target, source);
    const merged = {
      a: 'A',
      b: {
        c: 'Not C',
      },
    };
    const unchanged = {
      a: 'A',
      b: {
        c: 'C',
      },
    };
    assert.deepStrictEqual(actual, merged);
    assert.deepStrictEqual(target, unchanged);
  });

  test('deepMerge showcase', function () {
    const a = {
      address: {
        city: 'Berlin',
      },
      self: 'Icke',
    };
    const b = {
      familyName: 'Poor',
      address: {
        street: 'Unter den Linden',
      },
      rich: false,
      vehicles: ['bicycle'],
    };
    const c = {
      firstName: 'Joe',
      address: {
        number: '100',
      },
      self: 'Me',
      rich: true,
      vehicles: ['sports car', 'private jet', 'e-bike'],
    };
    const actual = deepMerge(a, b, c);
    const expected = {
      firstName: 'Joe',
      familyName: 'Poor',
      address: {
        number: '100',
        street: 'Unter den Linden',
        city: 'Berlin',
      },
      self: 'Me',
      rich: true,
      vehicles: ['sports car', 'private jet', 'e-bike'],
    };
    assert.deepStrictEqual(actual, expected);
  });
});
