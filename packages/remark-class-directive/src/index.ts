import { addHClasses, setHName } from "mdast-util-hast";
import { Node, Parent, isDirective } from "mdast-typeguards";
import { visit } from "pre-visit";

/**
 * Options for plugin remark-class-directive, for details see
 * https://github.com/christian-hackyourshack/npm/tree/main/packages/remark-class-directive
 */
export interface Options {
  /**
   * Name of the directive to use
   *
   * - default: 'class'
   */
  name?: string;
}

export default function (options: Options = {}) {
  const { name = 'class' } = options;
  const listName = `list-${name}`;
  return (root: unknown) => {
    visit(root as Parent, isDirective, (directive, parent, index, ancestors) => {
      if (parent) {
        if (directive.name === name) {
          if (directive.type === 'containerDirective') {
            // add the classes to the directive (div) element itself
            addHClasses(directive, directive.attributes.class);
          } else if (directive.type === 'textDirective') {
            if (directive.children.length > 0) {
              // text directive with [content]
              setHName(directive, 'span');
              addHClasses(directive, directive.attributes.class);
            } else {
              let node: Node;
              if (
                index > 0 &&
                (node = parent.children[index - 1]) &&
                node.type !== 'text' &&
                node.position?.end.column === directive.position?.start.column
              ) {
                addHClasses(node, directive.attributes.class);
              } else if (ancestors.length > 1 && ancestors[1].type === 'listItem') {
                // listItems have a wrapped paragraph that is removed by rehype,
                // so we want to add the style to the listItem
                addHClasses(ancestors[1], directive.attributes.class);
              } else {
                addHClasses(parent, directive.attributes.class);
              }
              // remove the directive
              parent.children.splice(index, 1);
            }
          } else /* leafDirective */ {
            if (directive.children.length > 0) {
              setHName(directive, 'div');
              addHClasses(directive, directive.attributes.class);
            } else {
              addHClasses(parent, directive.attributes.class);
              // remove the directive
              parent.children.splice(index, 1);
            }
          }
        } else if (directive.name === listName && directive.type === 'leafDirective') {
          const next = parent.children[index + 1];
          if (next?.type === 'list') {
            addHClasses(next, directive.attributes.class);
            // remove the directive
            parent.children.splice(index, 1);
          }
        }
      }
    });
  };
};

