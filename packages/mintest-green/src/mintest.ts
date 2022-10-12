import { AssertionError } from 'assert';
import { print, println } from './printColor';

type Fn = () => unknown;
type Test = { name: string; fn: Fn };
type Suite = {
  (name: string, fn: Fn): void;
  only(name: string, fn: Fn): void;
  skip(name: string, fn: Fn): void;
  beforeAll(fn: Fn): void;
  beforeEach(fn: Fn): void;
  afterEach(fn: Fn): void;
  afterAll(fn: Fn): void;
};

type Spec = (suite: Suite) => unknown;

export async function describe(name: string, spec: Spec) {
  const suite = createSuite(name);
  await spec(suite);
  return await suite.run();
}

function createSuite(suiteName: string) {
  const start = Date.now();
  const allTests: Test[] = [];
  const only: Test[] = [];
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  self.skip = function (name: string, fn: Fn) {};

  self.run = async function () {
    const tests = only[0] ? only : allTests;

    println.white(suiteName);
    let failed = 0;

    run(beforeAll);
    for (const test of tests) {
      run(beforeEach);
      try {
        await test.fn();
        println.green(`  ✓ ${test.name}`);
      } catch (e) {
        print.red(`  ✗ ${test.name} `);
        info(e);
        println.red('');
        failed++;
      }
      run(afterEach);
    }
    await run(afterAll);
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

async function run(functions: Fn[]) {
  for (const fn of functions)
    try {
      await fn();
      // eslint-disable-next-line no-empty
    } catch {}
}

function info(e: unknown) {
  if (e instanceof Error) {
    const stack = e.stack ?? '\n';
    const location = stack.slice(0, stack.indexOf('\n'));
    if (e instanceof AssertionError) {
      print.white(`Expected ${e.actual} ${e.operator} ${e.expected}: ${e.message}`);
    } else {
      print.white(e.message);
    }
    print.gray(` [${location}]`);
  } else {
    return `${e}`;
  }
}
