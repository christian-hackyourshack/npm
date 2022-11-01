import { createJsxElement, createProgram, isLeafDirective, visit } from 'm2dx-utils';
import type { Root, Text } from 'mdast';
import { join } from 'path';

export function includeDirective(root: Root, dir: string, directiveName = 'include'): void {
  let count = 0;
  visit(root, isLeafDirective, (directive, parent, index, ancestors) => {
    if (parent && directive.name === directiveName) {
      const name = `Include__${count++}`;
      const jsxElement = createJsxElement(
        `<${name}.Content components={${name}.components ?? {}} />`
      );
      const ref = (directive.children[0] as Text).value;
      const importElement = createProgram(`import * as ${name} from '${join(dir, ref)}';`);

      if (Object.keys(directive.attributes).includes('unwrap') && ancestors.length > 1) {
        const target = ancestors[1];
        const position = target.children.indexOf(parent) + 1;
        target.children.splice(position, 0, jsxElement);
        target.children.push(importElement);
        parent.children.splice(index, 1);
      } else {
        parent.children[index] = jsxElement;
        parent.children.push(importElement);
      }
    }
  });
}
