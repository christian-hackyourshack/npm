import assert from 'assert';
import { describe } from './mintest';

let count = 0;
function incr() {
  count++;
}

await describe('mintest', function (test) {
  test.beforeEach(incr);

  test('Foo', function () {
    assert.equal(2 + 2, 4);
  });
  test('Bar', function () {
    assert.equal(2 + 2, 4, 'Oh no!');
  });
  test.skip('Baz', function () {
    assert.equal(2 + 2, 5, 'This does not matter');
  });
});

assert.equal(count, 2);
