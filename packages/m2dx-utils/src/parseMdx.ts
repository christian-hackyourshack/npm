import type { Root } from 'mdast';
import { remark } from 'remark';
import remarkMdx from 'remark-mdx';
import remarkDirective from 'remark-directive';

export function parseMdx(mdx: string): Root {
  return remark().use(remarkMdx).use(remarkDirective).parse(mdx);
}
