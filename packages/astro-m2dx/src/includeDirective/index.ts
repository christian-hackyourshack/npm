import { createJsxElement, createProgram, isLeafDirective, visit } from 'm2dx-utils';
import type { Root, Text } from 'mdast';
import { join } from 'path';

export function includeDirective(root: Root, dir: string, directiveName = 'include'): void {
  let count = 0;
  visit(root, isLeafDirective, (directive, parent, index) => {
    if (parent && directive.name === directiveName) {
      const name = `Include__${count++}`;
      const ref = (directive.children[0] as Text).value;
      parent.children[index] = createJsxElement(
        `<${name}.Content components={${name}.components ?? {}} />`
      );
      parent.children.push(createProgram(`import * as ${name} from '${join(dir, ref)}';`));
    }
  });
}
