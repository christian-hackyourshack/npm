import type { MdxJsxFlowElement } from 'mdast-util-mdx';
import { parseMdx } from './parseMdx';

export function createJsxElement(value: string): MdxJsxFlowElement {
  const root = parseMdx(value);
  return root.children[0] as MdxJsxFlowElement;
}
