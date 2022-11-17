import { isImage, isParagraph, isText, isTextDirective, Node, visit } from 'm2dx-utils';
import type { Root } from 'mdast';

export function unwrapImages(root: Root): void {
  visit(root, (node, parent, index, ancestors) => {
    if (isImage(node) && index === 0 && isParagraph(parent)) {
      if (parent.children.filter(notIsWhitespace).length === 1) {
        const parentIndex = ancestors[1].children.indexOf(parent);
        ancestors[1].children.splice(parentIndex, 1, ...parent.children);
      }
    }
  });
}

function notIsWhitespace(node: Node): boolean {
  const isWhitespace = !node || (isText(node) && !node.value?.trim()) || isTextDirective(node);
  return !isWhitespace;
}
