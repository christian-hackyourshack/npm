import assert from 'assert';
import { describe } from 'mintest-green';
import { parseMdx } from 'm2dx-utils';
import { findUnresolved } from './findUnresolved';

await describe('mdx', function (test) {
  test('findUnresolved', function () {
    const input = parseMdx(`
import C, {A, B} from 'c';

<A />

<B>
    <C />
    <D>Unresolved</D>
</B>

<img src="foo.png" />
<Img src="foo.png" />

`);
    const found = findUnresolved(input);
    assert.equal(found.length, 2);
    assert.equal(found[0].name, 'D');
    assert.equal(found[1].name, 'Img');
  });
});
