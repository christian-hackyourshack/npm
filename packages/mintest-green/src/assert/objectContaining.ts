import assert, { AssertionError } from 'assert';

type ObjectLike = Record<string, unknown>;

/**
 * Type guard for real objects (map like structures, no arrays, no dates)
 *
 * @param object
 * @returns if object is an Object, but not an Array and not a Date
 */
function isObjectLike(object: unknown): object is ObjectLike {
  return (
    !!object && typeof object === 'object' && !Array.isArray(object) && !(object instanceof Date)
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function objectContaining(actual: unknown, expected: unknown) {
  if (!isObjectLike(actual)) {
    throw new AssertionError({ message: `actual must be an object but is a ${typeof actual}` });
  }
  if (!isObjectLike(expected)) {
    throw new AssertionError({ message: `expected must be an object but is a ${typeof expected}` });
  }
  Object.keys(expected).forEach((k) => {
    const actualValue = actual[k];
    const expectedValue = expected[k];
    if (actualValue === undefined && expectedValue !== undefined) {
      throw new AssertionError({
        message: `actual[${k}] is undefined`,
        actual: 'undefined',
        expected: expectedValue,
        operator: 'objectContaining',
      });
    } else if (isObjectLike(expectedValue)) {
      if (isObjectLike(actualValue)) {
        objectContaining(actualValue, expectedValue);
      } else {
        throw new AssertionError({
          message: `actual[${k}] is not an object, but ${typeof actualValue}`,
          actual: actualValue,
          expected: expectedValue,
          operator: 'objectContaining',
        });
      }
    } else {
      assert.equal(actualValue, expectedValue, 'objectContaining is unequal');
    }
  });
}
