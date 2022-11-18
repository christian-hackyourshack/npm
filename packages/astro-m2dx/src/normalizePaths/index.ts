import { normalizeRelative } from '@internal/utils';
import { isDirective, isMdxJsxFlowElement, Node, Predicate, visit } from 'm2dx-utils';
import type { Root } from 'mdast';

export interface Options {
  rebase?: string;
  checkExistence?: boolean;
  includeOnly?: string[];
  exclude?: string[];
}

export async function normalizePaths(
  root: Root,
  base: string,
  { rebase, checkExistence, includeOnly, exclude }: Options = {}
) {
  const isIncluded = (
    includeOnly && exclude
      ? (node: Node) =>
          (includeOnly.includes(node.type) || includeOnly.includes(tag(node))) &&
          !exclude.includes(node.type) &&
          !exclude.includes(tag(node))
      : includeOnly
      ? (node: Node) => includeOnly.includes(node.type) || includeOnly.includes(tag(node))
      : exclude
      ? (node: Node) => !exclude.includes(node.type) && !exclude.includes(tag(node))
      : () => true
  ) as Predicate<Node>;

  visit<Node>(root, isIncluded, function (node) {
    const url = node.url;
    if (typeof url === 'string' && !!url) {
      node.url = normalizeRelative(node.url, base, rebase, true, checkExistence);
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
}

function tag(node: Node): string {
  if (isMdxJsxFlowElement(node)) {
    return `<${node.name}>`;
  }
  return '__NO_TAG__';
}
