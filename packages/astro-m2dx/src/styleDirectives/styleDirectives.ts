import type { Root } from 'mdast';
import { isContainerDirective, isDirective, isLeafDirective } from '../utils/mdx';
import { Node, visit } from '../utils/mdx/visit';

export function styleDirectives(root: Root): void {
  visit(root, isDirective, (directive, parent, index) => {
    if (parent) {
      if (directive.name === 'style') {
        if (isContainerDirective(directive)) {
          addClasses(directive, directive.attributes.class);
        } else {
          addClasses(parent, directive.attributes.class);
          parent.children.splice(index, 1);
        }
      } else if (directive.name === 'list-style' && isLeafDirective(directive)) {
        const next = parent.children[index + 1];
        if (next?.type === 'list') {
          addClasses(next, directive.attributes.class);
          parent.children.splice(index, 1);
        }
      }
    }
  });
}

function addClasses(node: Node, styles: string) {
  const data = node.data ?? (node.data = {});
  const hProperties = data.hProperties ?? (data.hProperties = {});

  const classes = new Set();
  !!hProperties.class && (hProperties.class as string).split(/\s/).forEach((s) => classes.add(s));
  !!styles && styles.split(/\s/).forEach((s) => classes.add(s));
  hProperties.class = [...classes].join(' ');
}
