import { assert } from '../assert';
import { describe } from '../describe';

await describe('Sample 1', function (test) {
  test('it works', function () {
    assert.equal(2 + 2, 4);
  });
  test('it fails', function () {
    assert.equal(2 + 2, 5, 'Oh no!');
  });
  test('async is fine, too', async function () {
    await new Promise((resolve) => setTimeout(resolve, 250));
    assert.equal(1 + 1, 3, 'Pippi says, its true!');
  });
});
