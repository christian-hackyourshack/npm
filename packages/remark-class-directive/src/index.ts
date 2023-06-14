import { visit } from "pre-visit";

/**
 * Options for plugin remark-sectionize-headings, for details see
 * https://github.com/christian-hackyourshack/npm/tree/main/packages/remark-sectionize-headings
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
    visit(root as Node, isDirective, (directive, parent, index, ancestors) => {
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
                (node = parent.children[index - 1] as Node) &&
                node.type !== 'text' &&
                node.position.end.column === directive.position.start.column
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
          const next = parent.children[index + 1] as Node;
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

interface Node {
  type: string;
  position: {
    start: Column;
    end: Column;
  }
  data?: Record<string, unknown>;
}

interface Column {
  column: number;
}

interface Directive extends Node {
  type: 'containerDirective' | 'leafDirective' | 'textDirective';
  children: Node[];
  name: string;
  attributes: Record<string, string>;
}

function isDirective(node: unknown): node is Directive {
  if (Object.keys(node as Directive).includes('type')) {
    const type = (node as Directive).type;
    if (type === 'containerDirective' || type === 'leafDirective' || type === 'textDirective') {
      return true;
    }
  }
  return false;
}

type HProperties = Record<string, boolean | number | string | null | undefined | Array<string | number>>;

function getHProperties(node: Node): HProperties {
  const data = node.data ?? (node.data = {});
  return (data.hProperties ?? (data.hProperties = {})) as HProperties;
}

function addHClasses(node: Node, ...classes: string[]) {
  if (!classes || classes.length === 0) return;

  const hProperties = getHProperties(node);
  let existing = (hProperties.class as string)?.split(/\s/) ?? [];
  if (existing.length > 0) {
    classes = classes.filter((cls) => !existing.includes(cls));
    if (classes.length > 0) {
      hProperties.class += " " + classes.join(" ");
    }
  } else {
    hProperties.class = classes.join(" ");
  }
}

function setHName(node: Node, name: string) {
  const data = node.data ?? (node.data = {});
  data.hName = name;
}

