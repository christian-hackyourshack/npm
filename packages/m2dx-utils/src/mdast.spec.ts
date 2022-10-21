import { assert, describe } from 'mintest-green';
import { isHeading } from './mdast';

export const result = await describe('mdast', function (test) {
  test('Heading', function () {
    const input = { type: 'heading' };
    assert.equal(isHeading(input), true);
  });
});
