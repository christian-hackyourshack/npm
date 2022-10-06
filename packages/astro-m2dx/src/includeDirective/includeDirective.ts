import type { Root, Text } from 'mdast';
import { join } from 'path';
import { createJsxElement, createProgram, isLeafDirective } from '../utils/mdx';
import { visit } from '../utils/mdx/visit';

export function includeDirective(root: Root, dir: string, name = 'include'): void {
  let count = 0;
  visit(root, isLeafDirective, (directive, parent, index) => {
    if (parent && directive.name === name) {
      const name = `Include__${count++}`;
      const ref = (directive.children[0] as Text).value;
      parent.children[index] = createJsxElement(`<${name} />`);
      parent.children.push(
        createProgram(`import { Content as ${name} } from '${join(dir, ref)}';`)
      );
    }
  });
}
