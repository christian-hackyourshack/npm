import baseAssert, { AssertionError } from 'assert';

export type ObjectLike = Record<string, unknown>;

/**
 * Type guard for real objects (map like structures, no arrays, no dates)
 *
 * @param object
 * @returns if object is an Object, but not an Array and not a Date
 */
export function isObjectLike(object: unknown): object is ObjectLike {
  return (
    !!object && typeof object === 'object' && !Array.isArray(object) && !(object instanceof Date)
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function objectContaining(actual: unknown, expected: unknown) {
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
      throw new AssertionError({});
    } else if (isObjectLike(expectedValue)) {
      if (isObjectLike(actualValue)) {
        objectContaining(actualValue, expectedValue);
      } else {
        throw new AssertionError({});
      }
    } else {
      assert.equal(actualValue, expectedValue);
    }
  });
}

type AssertPlus = typeof baseAssert & {
  objectContaining: (actual: unknown, expected: unknown) => void;
};

export const assert = baseAssert as AssertPlus;
assert.objectContaining = objectContaining;

export default assert;
