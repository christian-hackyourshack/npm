import { AssertionError } from 'assert';
import type { Fn } from './Fn';
import { print, println } from './printColor';

export function createSuite(suiteName: string) {
  const start = Date.now();
  const allTests: { name: string; fn: Fn }[] = [];
  const only: { name: string; fn: Fn }[] = [];
  const beforeAll: Fn[] = [];
  const beforeEach: Fn[] = [];
  const afterEach: Fn[] = [];
  const afterAll: Fn[] = [];

  function self(name: string, fn: Fn) {
    allTests.push({ name, fn });
  }

  self.only = function (name: string, fn: Fn) {
    only.push({ name, fn });
  };

  self.beforeAll = function (fn: Fn) {
    beforeAll.push(fn);
  };

  self.beforeEach = function (fn: Fn) {
    beforeEach.push(fn);
  };

  self.afterEach = function (fn: Fn) {
    afterEach.push(fn);
  };

  self.afterAll = function (fn: Fn) {
    afterAll.push(fn);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  self.skip = function (name: string, fn: Fn) {
    // do not add to tests, hence skip execution
  };

  self.run = async function () {
    const tests = only[0] ? only : allTests;

    print('\n\n' + suiteName);
    print.gray(` [${caller()}]`);
    println();
    let failed = 0;

    runAll(beforeAll);
    for (const test of tests) {
      runAll(beforeEach);
      try {
        await test.fn();
        println.green(`  ✓ ${test.name}`);
      } catch (e) {
        print.red(`  ✗ ${test.name} `);
        info(e);
        println.red('');
        failed++;
      }
      runAll(afterEach);
    }
    await runAll(afterAll);
    if (failed === 0) {
      println.green(
        `${tests.length} test${tests.length > 1 ? 's' : ''} passed [${Date.now() - start}ms]`
      );
    } else {
      println.red(
        `${failed} out of ${tests.length} test${tests.length > 1 ? 's' : ''} failed [${
          Date.now() - start
        }ms]`
      );
    }
    return failed;
  };

  return self;
}

async function runAll(functions: Fn[]) {
  for (const fn of functions)
    try {
      await fn();
    } catch (e) {
      console.error(e);
    }
}

function info(e: unknown) {
  if (e instanceof Error) {
    if (e instanceof AssertionError) {
      print(`'${e.actual}' ${e.operator} '${e.expected}': ${e.message}`);
    } else {
      print(e.message);
    }
    print.gray(` [${origin(e)}]`);
  } else {
    return `${e}`;
  }
}

const BETWEEN_BRACES = /\(([^)]+)\)/;
function caller() {
  const stack = (new Error().stack ?? '').split('\n');
  return (stack[stack.length - 1].match(BETWEEN_BRACES) ?? ['', 'unknown'])[1];
}

function origin(e: Error) {
  const stack = (e.stack ?? '').split('\n');
  const index = stack.findIndex((s) => s.includes('at Function.self.run')) - 1;
  return (stack[index > 0 ? index : 1].match(BETWEEN_BRACES) ?? ['', 'unknown'])[1];
}
