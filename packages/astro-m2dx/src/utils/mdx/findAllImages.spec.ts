import { assert, describe } from 'mintest-green';
import { parseMdx } from './parseMdx';
import { findAllImages } from './findAllImages';

await describe('findAllImages', function (test) {
  test('playground', function () {
    const input = parseMdx(`
![Astronaut with vacuum cleaner](astronaut-with-vacuum-cleaner.png)

`);
    const found = findAllImages(input);
    assert.equal(found.length, 1);
  });
});
