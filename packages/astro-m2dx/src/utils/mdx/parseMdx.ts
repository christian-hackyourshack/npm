import type { Root } from 'mdast';
import { remark } from 'remark';
import remarkMdx from 'remark-mdx';

export function parseMdx(mdx: string): Root {
  return remark().use(remarkMdx).parse(mdx);
}
