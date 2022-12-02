import { isObjectLike } from '@internal/utils';
import assert, { AssertionError } from 'assert';
import { objectContaining } from './objectContaining';

export function arrayContaining(actual: unknown, expected: unknown) {
  if (!Array.isArray(actual)) {
    throw new AssertionError({ message: `actual must be an object but is a ${typeof actual}` });
  }
  if (!Array.isArray(expected)) {
    throw new AssertionError({ message: `expected must be an object but is a ${typeof expected}` });
  }
  expected.forEach((expectedValue, index) => {
    const assertion = Array.isArray(expectedValue)
      ? arrayContaining
      : isObjectLike(expectedValue)
      ? objectContaining
      : assert.equal;
    if (
      !actual.some((actualValue) => {
        try {
          assertion(actualValue, expectedValue);
          return true;
        } catch {
          return false;
        }
      })
    ) {
      throw new AssertionError({
        message: `actual does not contain a value matching, expected[${index}]`,
        expected: expectedValue,
        operator: 'arrayContaining',
      });
    }
  });
}
