import { readFileSync, rmSync } from 'fs';
import assert from './assert';
import { describe } from './describe';
import { getSnapshotPath, snapshot } from './snapshot';
import { AssertionError } from 'assert';

await describe('snapshot', function (test) {
  test('creates a new snapshot', function () {
    const id = 'creates-a-new-snapshot';
    const snapshotPath = getSnapshotPath(id);
    rmSync(snapshotPath, { force: true });

    const expected = 'creates a new snapshot';
    snapshot(expected, id);
    const actual = readFileSync(snapshotPath, 'utf8');
    assert.equal(actual, expected);
  });
  test('fails on unequal snapshot', function () {
    const id = 'fails-on-unequal-snapshot';
    const snapshotPath = getSnapshotPath(id);
    rmSync(snapshotPath, { force: true });

    const initial = 'fails on unequal snapshot';
    snapshot(initial, id);
    const changed = 'fails on equal snapshot';
    try {
      snapshot(changed, id);
    } catch (e) {
      if (e instanceof AssertionError) {
        assert.equal(e.operator, 'snapshot');
      } else {
        throw e;
      }
    }
  });
});
