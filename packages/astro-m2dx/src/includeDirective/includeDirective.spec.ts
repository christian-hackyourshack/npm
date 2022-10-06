import { join } from 'path';
import { describe, expect, test } from 'vitest';
import { parseMdx } from '../utils/mdx';
import { includeDirective } from './includeDirective';

const fixtures = join(process.cwd(), 'fixtures', 'includeDirective');

describe('includeDirective', function () {
  test('playground', function () {
    const input = parseMdx(`
::include[./partial.mdx]
`);
    includeDirective(input, fixtures);
    expect(input.children.length).toBe(2);
    expect(input.children[0]).toEqual(
      expect.objectContaining({
        type: 'mdxJsxFlowElement',
        name: 'Include__0',
      })
    );
    expect(input.children[1]).toEqual(
      expect.objectContaining({
        type: 'mdxjsEsm',
        value: `import { Content as Include__0 } from '${fixtures}/partial.mdx';`,
      })
    );
  });
});
