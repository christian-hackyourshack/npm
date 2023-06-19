import { existsSync } from 'fs';
import { isAbsolute, join, relative } from 'path';
import { Predicate, visit } from "pre-visit";

/**
 * Options for plugin remark-normalize-paths, for details see
 * https://github.com/christian-hackyourshack/npm/tree/main/packages/remark-normalize-paths
 */
export interface Options {
  rebase?: string;
  checkExistence?: boolean;
  include?: string[];
  exclude?: string[];
}

export default function ({ rebase, checkExistence, include, exclude }: Options = {}) {

  const isIncluded = (
    include && exclude
      ? (node: Node) =>
        (include.includes(node.type) || include.includes(tag(node))) &&
        !exclude.includes(node.type) && !exclude.includes(tag(node))
      : include
        ? (node: Node) => include.includes(node.type) || include.includes(tag(node))
        : exclude
          ? (node: Node) => !exclude.includes(node.type) && !exclude.includes(tag(node))
          : () => true) as Predicate<Node>;

  return (root: Node, file?: { dirname: string | undefined }) => {
    const base = file?.dirname || process.cwd();
    visit(root, isIncluded, (node) => {
      if (node.url && typeof node.url === 'string') {
        node.url = normalizeRelative(
          node.url, base, rebase, true, checkExistence);
      }
      if (isMdxJsxFlowElement(node)) {
        node.attributes.forEach((a) => {
          if (typeof a.value === 'string') {
            a.value = normalizeRelative(a.value, base, rebase, false, checkExistence);
          }
        });
      } else if (isDirective(node)) {
        for (const key of Object.keys(node.attributes)) {
          node.attributes[key] = normalizeRelative(
            node.attributes[key],
            base,
            rebase,
            false,
            checkExistence
          );
        }
      }
    });
  };
};

function normalizeRelative(
  src: string,
  base?: string,
  newbase?: string,
  isPath = false,
  checkExistence = false
): string {
  let newsrc = src.replaceAll('\\', '/'); // to Linux
  if ((isPath && !isAbsolute(src)) || newsrc.startsWith('./') || newsrc.startsWith('../')) {
    newsrc = join(base ?? process.cwd(), newsrc).replaceAll('\\', '/'); // to Linux;
    if (newbase) {
      newsrc = relative(newbase, newsrc);
    }
    if (
      !isPath &&
      !newsrc.startsWith('/') &&
      !newsrc.startsWith('./') &&
      !newsrc.startsWith('../')
    ) {
      newsrc = './' + newsrc;
    }
    if (newsrc !== src) {
      const toCheck = newbase ? join(newbase, newsrc) : newsrc;
      if (!checkExistence || existsSync(toCheck)) {
        return newsrc;
      }
    }
  }
  return src;
}

interface Node {
  type: string;
  url?: string;
  data?: Record<string, unknown>;
}

interface MdxJsxFlowElement extends Node {
  type: "mdxJsxFlowElement"
  name: string;
  attributes: Array<{
    value: unknown;
  }>;
}

function isMdxJsxFlowElement(node: unknown): node is MdxJsxFlowElement {
  return !!node && (node as Node).type === 'mdxJsxFlowElement';
}

interface Directive extends Node {
  type: 'containerDirective' | 'leafDirective' | 'textDirective';
  children: Node[];
  name: string;
  attributes: Record<string, string>;
}

function isDirective(node: unknown): node is Directive {
  if (node && Object.keys(node).includes('type')) {
    const type = (node as Node).type;
    return type === 'containerDirective' || type === 'leafDirective' || type === 'textDirective';
  }
  return false;
}

function tag(node: Node): string {
  if (isMdxJsxFlowElement(node)) {
    return `<${node.name}>`;
  }
  return '__NO_TAG__';
}
