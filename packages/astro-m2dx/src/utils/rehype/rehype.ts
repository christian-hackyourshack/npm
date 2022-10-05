import type { Root } from 'mdast';
import { toHast } from 'mdast-util-to-hast';
import { toHtml } from 'hast-util-to-html';

export function rehype(root: Root): string {
  const hast = toHast(root, { allowDangerousHtml: true });
  const html = toHtml(hast!, { allowDangerousHtml: true });
  return html;
}
