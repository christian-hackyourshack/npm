import { createSuite } from './createSuite';
import type { Suite } from './Suite';

export async function describe(name: string, spec: (suite: Suite) => unknown) {
  const suite = createSuite(name);
  await spec(suite);
  return await suite.run();
}
