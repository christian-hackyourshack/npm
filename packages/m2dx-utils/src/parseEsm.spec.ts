import { assert, describe } from 'mintest-green';
import { parseEsm } from './parseEsm';

export const result = await describe('parseEsm', function (test) {
  test('empty', function () {
    const input = ``;
    const actual = parseEsm(input);
    assert.equal(actual.type, 'Program');
    assert.equal(actual.body.length, 0);
  });

  test('empty', function () {
    const input = `
import { value } from 'values';

// comment: double the value
export const double = value + value;
`;
    const actual = parseEsm(input);
    assert.equal(actual.type, 'Program');
    assert.equal(actual.body.length, 2);
  });
});
