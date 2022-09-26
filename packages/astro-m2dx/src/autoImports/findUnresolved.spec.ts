import { describe, expect, test } from 'vitest';
import { parseMdx } from '../utils/mdx';
import { findUnresolved } from './findUnresolved';

describe('mdx', function () {
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
    expect(found.length).toBe(2);
    expect(found[0].name).toBe('D');
    expect(found[1].name).toBe('Img');
  });
});
