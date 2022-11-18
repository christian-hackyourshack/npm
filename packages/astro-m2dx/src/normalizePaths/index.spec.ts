import {
  find,
  isImage,
  isJsxTag,
  isLeafDirective,
  isLink,
  isMdxJsxAttribute,
  parseMdx,
} from 'm2dx-utils';
import { assert, describe } from 'mintest-green';
import { normalizePaths } from '.';

export const result = await describe('normalizePaths', function (test) {
  test('playground', async function () {
    const root = parseMdx(`

![](./picture.jpg)

[Read more](./all/index.html)

<img src="../other-picture.png" />

::Quote[MDX is great]{author="Me" avatar="./me.jpg" .xxl}

<CustomComponent ref="./input.txt" />

`);
    normalizePaths(root, '/root/workspace/foo', { exclude: ['link', '<CustomComponent>'] });
    assert.equal(find(root, isImage)!.url, '/root/workspace/foo/picture.jpg');
    assert.equal(find(root, isLink)!.url, './all/index.html');
    assert.equal(
      find(root, isJsxTag('img'))!.attributes.find((a) => isMdxJsxAttribute(a) && a.name === 'src')
        ?.value,
      '/root/workspace/other-picture.png'
    );
    assert.equal(find(root, isLeafDirective)!.attributes['avatar'], '/root/workspace/foo/me.jpg');
    assert.equal(
      find(root, isJsxTag('CustomComponent'))!.attributes.find(
        (a) => isMdxJsxAttribute(a) && a.name === 'ref'
      )?.value,
      './input.txt'
    );
  });
});
