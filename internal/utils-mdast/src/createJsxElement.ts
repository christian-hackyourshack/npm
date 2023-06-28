import type { MdxJsxFlowElement } from 'mdast-util-mdx';
import { remark } from 'remark';
import remarkMdx from 'remark-mdx';

export function createJsxElement(value: string): MdxJsxFlowElement {
  const root = parseMdx(value);
  return root.children[0] as MdxJsxFlowElement;
}

function parseMdx(mdx: string): { children: unknown[] } {
  return remark().use(remarkMdx).parse(mdx);
}
