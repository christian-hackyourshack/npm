import { isInlineCode, isText, Node } from './mdast';
import { visit } from './visit';

export function toText(root: Node, sep = ' ') {
  const buffer: string[] = [];
  visit(root, (node) => {
    if (isText(node) || isInlineCode(node)) {
      buffer.push(node.value);
    }
  });
  return buffer
    .map((s) => s.trim())
    .join(sep)
    .trim();
}
