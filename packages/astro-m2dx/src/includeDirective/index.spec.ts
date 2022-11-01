import { parseMdx } from 'm2dx-utils';
import { assert, describe } from 'mintest-green';
import { join } from 'path';
import { includeDirective } from '.';

const fixtures = join(process.cwd(), 'fixtures', 'includeDirective');

export const result = await describe('includeDirective', function (test) {
  test('playground', function () {
    const input = parseMdx(`
::include[./partial.mdx]
`);
    includeDirective(input, fixtures);
    assert.equal(input.children.length, 2);
    assert.objectContaining(input.children[0], {
      type: 'mdxJsxFlowElement',
      name: 'Include__0.Content',
    });
    assert.objectContaining(input.children[1], {
      type: 'mdxjsEsm',
      value: `import * as Include__0 from '${fixtures}/partial.mdx';`,
    });
  });

  test('unwrap', function () {
    const input = parseMdx(`
<section>
::include[./partial.mdx]{unwrap}
</section>
`);
    includeDirective(input, fixtures);
    assert.equal(input.children.length, 3);
    assert.objectContaining(input.children[0], {
      type: 'mdxJsxFlowElement',
      name: 'section',
    });
    assert.objectContaining(input.children[1], {
      type: 'mdxJsxFlowElement',
      name: 'Include__0.Content',
    });
    assert.objectContaining(input.children[2], {
      type: 'mdxjsEsm',
      value: `import * as Include__0 from '${fixtures}/partial.mdx';`,
    });
  });
});
