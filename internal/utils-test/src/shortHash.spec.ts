import { shortHash } from '@internal/utils';
import { assert, describe } from 'mintest-green';

describe('shortHash', function (test) {
  test('playground', function () {
    assert.equal(shortHash('Shackhacker'), 't57cs3e3ahsb');
    assert.equal(
      shortHash(
        'A very long string. A very long string. A very long string. A very long string. A very long string. A very long string. A very long string. A very long string. A very long string. A very long string. A very long string. A very long string. A very long string. A very long string. A very long string. A very long string. A very long string. A very long string. A very long string. A very long string. A very long string. A very long string. A very long string. A very long string. A very long string. A very long string. A very long string. A very long string. A very long string. '
      ),
      't5u3gchcf58k'
    );
  });
});
