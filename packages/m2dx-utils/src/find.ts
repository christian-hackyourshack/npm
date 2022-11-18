import type { Node } from './mdast';
import { EXIT, Predicate, visit } from './visit';

export function find<T extends Node>(root: Node, predicate: Predicate<T>): T | undefined {
  let found: T | undefined;
  visit(root, predicate, function (node) {
    found = node;
    return EXIT;
  });
  return found;
}
