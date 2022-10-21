import { getCallerLocation, println, shortHash, truncate } from '@internal/utils';
import { AssertionError } from 'assert';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export const MINTEST_DIR = join(process.cwd(), '.mintest');
function init() {
  mkdirSync(MINTEST_DIR, { recursive: true });
  writeFileSync(join(MINTEST_DIR, '.gitignore'), `snapshot-*.failed`);
}
init();

export function snapshot(actual: unknown, id?: string) {
  const { file, line } = getCallerLocation(1);
  const snapshotName = `snapshot-${shortHash({ file, id: id ?? line }, 12)}`;
  const snapshotPath = join(MINTEST_DIR, snapshotName);
  const actualString = typeof actual === 'string' ? actual : JSON.stringify(actual);
  try {
    const expected = readFileSync(snapshotPath, 'utf8');
    if (actualString !== expected) {
      const failedPath = snapshotPath + '.failed';
      writeFileSync(failedPath, actualString);
      throw new AssertionError({
        message: `'${truncate(actualString, 32, true)}' does not equal snapshot '${truncate(
          expected,
          32,
          true
        )}'`,
        operator: 'snapshot',
        actual: failedPath,
        expected: snapshotPath,
      });
    }
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((e as any).code === 'ENOENT') {
      println.gray(`    Creating new snapshot for '${id ?? `line ${line}`}': ${snapshotPath}`);
      writeFileSync(snapshotPath, actualString);
    } else {
      throw e;
    }
  }
}

export function getSnapshotPath(id: string) {
  const { file } = getCallerLocation(1);
  const snapshotName = `snapshot-${shortHash({ file, id }, 12)}`;
  return join(MINTEST_DIR, snapshotName);
}
