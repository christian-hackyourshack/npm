import assert from 'assert';
import { objectContaining } from './objectContaining';
import { snapshot } from './snapshot';

type AssertPlus = typeof assert & {
  objectContaining: (actual: unknown, expected: unknown) => void;
  snapshot: (actual: unknown, id?: string) => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(assert as any).objectContaining = objectContaining;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(assert as any).snapshot = snapshot;

export default assert as AssertPlus;
