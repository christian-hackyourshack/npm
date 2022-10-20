import type { Root } from 'mdast';
import {
  isContainerDirective,
  isDirective,
  isImage,
  isLeafDirective,
  isListItem,
  isTextDirective,
  Node,
  visit,
} from '../utils/mdx';

export function styleDirectives(root: Root): void {
  visit(root, isDirective, (directive, parent, index, ancestors) => {
    if (parent) {
      if (directive.name === 'style') {
        if (isContainerDirective(directive)) {
          // add the classes to the directive (div) element itself
          addClasses(directive, directive.attributes.class);
        } else if (isTextDirective(directive)) {
          let image: Node;
          if (
            index > 0 &&
            (image = parent.children[index - 1]) &&
            isImage(image) &&
            image.position!.end.column === directive.position!.start.column
          ) {
            addClasses(image, directive.attributes.class);
          } else if (ancestors.length > 1 && isListItem(ancestors[1])) {
            // listItems have a wrapped paragraph that is removed by rehype,
            // so we want to add the style to the listItem
            addClasses(ancestors[1], directive.attributes.class);
          } else {
            addClasses(parent, directive.attributes.class);
          }
          parent.children.splice(index, 1);
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
