import { assert, describe } from '.';

const counters = {
  beforeAll: 0,
  beforeEach: 0,
  afterEach: 0,
  afterAll: 0,
};

export const result = await describe('mintest', function (test) {
  test.beforeAll(() => counters.beforeAll++);
  test.beforeEach(() => counters.beforeEach++);
  test.afterEach(() => counters.afterEach++);
  test.afterAll(() => counters.afterAll++);

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

assert.deepStrictEqual(counters, {
  beforeAll: 1, //
  beforeEach: 2,
  afterEach: 2,
  afterAll: 1,
});
