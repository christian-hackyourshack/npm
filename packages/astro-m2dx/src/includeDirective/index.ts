import { toLinux } from '@internal/utils';
import {
  addHClasses,
  createJsxElement,
  createProgram,
  isLeafDirective,
  Node,
  setHName,
  visit,
} from 'm2dx-utils';
import type { Content, Root, Text } from 'mdast';
import { join } from 'path';

export function includeDirective(root: Root, dir: string, directiveName = 'include'): void {
  let count = 0;
  visit(root, isLeafDirective, (directive, parent, index, ancestors) => {
    if (parent && directive.name === directiveName) {
      const name = `Include__${count++}`;
      let included: Node = createJsxElement(
        `<${name}.Content components={${name}.components ?? {}} />`
      );
      const ref = (directive.children[0] as Text).value;
      const importElement = createProgram(`import * as ${name} from '${toLinux(join(dir, ref))}';`);
      const classes = directive.attributes['class'];
      if (classes) {
        setHName(directive, 'div');
        addHClasses(directive, directive.attributes.class);
        directive.children = [included as Content];
        included = directive;
      }

      if (Object.keys(directive.attributes).includes('unwrap') && ancestors.length > 1) {
        const target = ancestors[1];
        const position = target.children.indexOf(parent) + 1;
        target.children.splice(position, 0, included);
        target.children.push(importElement);
        parent.children.splice(index, 1);
      } else {
        parent.children[index] = included;
        parent.children.push(importElement);
      }
    }
  });
}
