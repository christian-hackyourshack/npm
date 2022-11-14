import { toHtml } from 'hast-util-to-html';
import type { Root } from 'mdast';
import { toHast } from 'mdast-util-to-hast';
import { remark as parser } from 'remark';

export function remark(md: string): Root {
  return parser().parse(md);
}

export function rehype(root: Root): string {
  const hast = toHast(root, { allowDangerousHtml: true });
  const html = toHtml(hast!, { allowDangerousHtml: true });
  return html;
}
