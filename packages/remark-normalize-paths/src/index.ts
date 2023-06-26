import { Node, isDirective } from "@internal/mdast-util";
import { isMdxJsxFlowElement } from "@internal/mdast-util-mdx";
import { existsSync } from 'fs';
import { join, relative } from 'path';
import { Predicate, visit } from "pre-visit";

/**
 * Options for plugin remark-normalize-paths, for details see
 * https://github.com/christian-hackyourshack/npm/tree/main/packages/remark-normalize-paths
 */
export interface Options {
  /**
   * Path to use as new base path and make all resulting paths relative to this path.
   * 
   * Default is`undefined`, i.e.resulting paths will be absolute.
   */
  rebase?: string;
  /**
   * Normalize path only, if normalized path exists, leave untouched otherwise.
   * 
   * Default is`true`.
   */
  checkExistence?: boolean;
  /**
   * List of MDX element types or JSX tags(if put in angle brackets, e.g. `<img>`)to include during path normalization(only the named types will be included).
   * 
   * Default is`undefined`, i.e.all MDX element types will be included.
   */
  include?: string[];
  /**
   * List of MDX element types or JSX tags(if put in angle brackets, e.g. `<img>`) to exclude during path normalization.E.g. `['link', '<a>']` to exclude markdown links and JSX anchor tags.
   * 
   * Default is`undefined`, i.e.no MDX element types will be excluded.
   */
  exclude?: string[];
}

export default function ({ rebase, checkExistence, include, exclude }: Options = {}) {

  const isIncluded = (
    include && exclude
      ? (node: Node) =>
        (include.includes(node.type) || include.includes(toJsxTag(node))) &&
        !exclude.includes(node.type) && !exclude.includes(toJsxTag(node))
      : include
        ? (node: Node) => include.includes(node.type) || include.includes(toJsxTag(node))
        : exclude
          ? (node: Node) => !exclude.includes(node.type) && !exclude.includes(toJsxTag(node))
          : () => true) as Predicate<Node>;

  return (root: Node, file?: { dirname?: string }) => {
    const base = file?.dirname;
    if (!base) return;
    visit(root, isIncluded, (node) => {
      if (node.url && typeof node.url === 'string') {
        node.url = normalize(node.url, base, rebase, checkExistence);
      }
      if (isMdxJsxFlowElement(node)) {
        node.attributes.forEach((a) => {
          if (typeof a.value === 'string') {
            a.value = normalize(a.value, base, rebase, checkExistence);
          }
        });
      } else if (isDirective(node)) {
        for (const key of Object.keys(node.attributes)) {
          node.attributes[key] = normalize(
            node.attributes[key],
            base,
            rebase,
            checkExistence
          );
        }
      }
    });
  };
};

function toJsxTag(node: Node): string {
  if (isMdxJsxFlowElement(node)) {
    return `<${node.name}>`;
  }
  return '__NO_TAG__';
}

function normalize(
  src: string,
  base: string,
  rebase?: string,
  checkExistence = false
): string {
  if (!src.startsWith('.')) return src;

  let newsrc = src.replaceAll('\\', '/'); // to Linux
  if (newsrc.startsWith('./') || newsrc.startsWith('../')) {
    newsrc = join(base, newsrc).replaceAll('\\', '/'); // to Linux;
    if (rebase) {
      newsrc = relative(rebase, newsrc);
    }
    if (
      !newsrc.startsWith('/') &&
      !newsrc.startsWith('./') &&
      !newsrc.startsWith('../')
    ) {
      newsrc = './' + newsrc;
    }
    if (newsrc !== src) {
      const toCheck = rebase ? join(rebase, newsrc) : newsrc;
      if (!checkExistence || existsSync(toCheck)) {
        return newsrc;
      }
    }
  }
  return src;
}
