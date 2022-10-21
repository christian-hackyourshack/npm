import { fill, println, withColor as c } from '@internal/utils';
import glob from 'glob';
import { join } from 'path';
import { isResult, Result } from '../index.js';

export async function run(pattern = 'src/{**/*.spec.ts,tests/**/*.ts}') {
  const start = Date.now();
  const mintestGreen = c.onCyan('mintest') + '-' + c.onGreen('green');
  println(`${mintestGreen} executing on '${pattern}'...`);

  const overall = new Result();
  const files = glob.sync(pattern);
  for (const file of files) {
    try {
      const suite = await import(join(process.cwd(), file));
      if (isResult(suite.result)) {
        overall.add(suite.result);
      }
    } catch (e) {
      if (e instanceof Error) {
        overall.addError(e);
      }
    }
  }
  println();
  if (overall.success) {
    println.onGreen('       ALL TESTS PASSED       ');
    println.green(`All ${overall.all} tests passed [${Date.now() - start}ms]`);
  } else {
    if (overall.failed > 0) {
      const reds = Math.max(1, Math.round((overall.failed / overall.all) * 32));
      println(c.onRed(fill('', reds) + c.onGreen(fill('', 32 - reds))));
      println.red(`${overall.failed} out of ${overall.all} tests failed [${Date.now() - start}ms]`);
    }
    if (overall.errors.length > 0) {
      println.onRed(`   ERROR${overall.errors.length > 1 ? 'S' : ''}   `);
      overall.errors.forEach((e) => {
        e.message.split('\n').forEach((l) => println.red(l));
      });
    }
  }
  return overall;
}
