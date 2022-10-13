import { AssertionError } from 'assert';
import { createHash } from 'crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, relative } from 'path';
import { println } from './printColor';

export const MINTEST_DIR = join(process.cwd(), '.mintest');
function init() {
  mkdirSync(MINTEST_DIR, { recursive: true });
  writeFileSync(join(MINTEST_DIR, '.gitignore'), `snapshot-*.failed`);
}
init();

const BETWEEN_BRACES = /\(([^)]+)\)/;
const NO_MATCH = [undefined, undefined];
export function snapshot(actual: unknown, id?: string) {
  const { file, line } = getCallerLocation();
  const snapshotName = `snapshot-${hash(`${file}__${id ?? line}`)}`;
  const snapshotPath = join(MINTEST_DIR, snapshotName);
  const actualString = typeof actual === 'string' ? actual : JSON.stringify(actual);
  try {
    const expected = readFileSync(snapshotPath, 'utf8');
    if (actualString !== expected) {
      const failedPath = snapshotPath + '.failed';
      writeFileSync(failedPath, actualString);
      throw new AssertionError({
        message: `'${shorten(actualString, 20)}' does not equal snapshot '${shorten(
          expected,
          20
        )}'`,
        operator: 'snapshot',
        actual: failedPath,
        expected: snapshotPath,
      });
    }
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((e as any).code === 'ENOENT') {
      println.gray(
        `    No snapshot found for '${file}:${id ?? line}' creating new one (${snapshotPath})...`
      );
      writeFileSync(snapshotPath, actualString);
    } else {
      throw e;
    }
  }
}

export function getSnapshotPath(id: string) {
  const { file } = getCallerLocation();
  const snapshotName = `snapshot-${hash(`${file}__${id}`)}`;
  return join(MINTEST_DIR, snapshotName);
}

function getCallerLocation() {
  const stack = new Error().stack?.split('\n') ?? [];
  const location = (stack[3].match(BETWEEN_BRACES) ?? NO_MATCH)[1] ?? hash(stack.join('_'));
  const segments = location.split(':');
  const file = relative(process.cwd(), segments[0]);
  const line = segments[1];
  return { file, line };
}

function hash(data: string) {
  return createHash('shake256', { outputLength: 12 }).update(data, 'utf8').digest('hex');
}

function shorten(s: string, length: number) {
  s = s.replaceAll(/\s/g, ' ');
  return s.length > length ? s.slice(0, length - 1) + '&hellip;' : s;
}
