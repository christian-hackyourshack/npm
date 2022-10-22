#!/usr/bin/env tsx
import { exit } from 'process';
import { run } from '.';

// TODO: Use commander or something similar for some CLI options

(async function () {
  const result = await run();
  exit(result.success ? 0 : 1);
})();
