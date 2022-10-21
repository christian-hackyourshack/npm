import { createSuite } from './createSuite.js';
import type { Suite } from './Suite.js';

export async function describe(name: string, spec: (suite: Suite) => unknown) {
  const suite = createSuite(name);
  await spec(suite);
  return await suite.run();
}

export * from './Result.js';
