import glob from 'glob';
import { join } from 'path';
import { print, println } from './printColor';

export function runSuites(pattern = 'src/{**/*.spec.ts,tests/**/*.ts}') {
  print('Running ');
  print.cyan('mintest');
  print.onGreen('-green');
  println(` on '${pattern}'...`);

  glob(pattern, async (e, suites) => {
    if (e) {
      console.error(e);
    }
    for (const suite of suites) {
      try {
        await import(join(process.cwd(), suite));
      } catch (e) {
        console.error(e);
      }
    }
  });
}
