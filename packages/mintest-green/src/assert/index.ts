import assert from 'assert';
import { arrayContaining } from './arrayContaining';
import { objectContaining } from './objectContaining';
import { snapshot } from './snapshot';

type AssertPlus = typeof assert & {
  arrayContaining: (actual: unknown, expected: unknown) => void;
  objectContaining: (actual: unknown, expected: unknown) => void;
  snapshot: (actual: unknown, id?: string) => void;
};

const assertPlus = assert as AssertPlus;
assertPlus.arrayContaining = arrayContaining;
assertPlus.objectContaining = objectContaining;
assertPlus.snapshot = snapshot;

export default assertPlus as AssertPlus;
