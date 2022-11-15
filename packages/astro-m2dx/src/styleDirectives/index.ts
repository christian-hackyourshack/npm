import {
  addHClasses,
  isContainerDirective,
  isDirective,
  isLeafDirective,
  isListItem,
  isText,
  isTextDirective,
  Node,
  setHName,
  visit,
} from 'm2dx-utils';
import type { Root } from 'mdast';

export function styleDirectives(root: Root, style = 'style'): void {
  const listStyle = `list-${style}`;
  visit(root, isDirective, (directive, parent, index, ancestors) => {
    if (parent) {
      if (directive.name === style) {
        if (isContainerDirective(directive)) {
          // add the classes to the directive (div) element itself
          addHClasses(directive, directive.attributes.class);
        } else if (isTextDirective(directive)) {
          let node: Node;
          if (directive.children.length > 0) {
            // text directive with [content]
            setHName(directive, 'span');
            addHClasses(directive, directive.attributes.class);
          } else {
            if (
              index > 0 &&
              (node = parent.children[index - 1]) &&
              !isText(node) &&
              node.position!.end.column === directive.position!.start.column
            ) {
              addHClasses(node, directive.attributes.class);
            } else if (ancestors.length > 1 && isListItem(ancestors[1])) {
              // listItems have a wrapped paragraph that is removed by rehype,
              // so we want to add the style to the listItem
              addHClasses(ancestors[1], directive.attributes.class);
            } else {
              addHClasses(parent, directive.attributes.class);
            }
            // remove the directive
            parent.children.splice(index, 1);
          }
        } else {
          if (directive.children.length > 0) {
            setHName(directive, 'div');
            addHClasses(directive, directive.attributes.class);
          } else {
            addHClasses(parent, directive.attributes.class);
            // remove the directive
            parent.children.splice(index, 1);
          }
        }
      } else if (directive.name === listStyle && isLeafDirective(directive)) {
        const next = parent.children[index + 1];
        if (next?.type === 'list') {
          addHClasses(next, directive.attributes.class);
          // remove the directive
          parent.children.splice(index, 1);
        }
      }
    }
  });
}
