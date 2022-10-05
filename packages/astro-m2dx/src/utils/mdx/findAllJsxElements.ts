import type { Root } from 'mdast';
import type { MdxJsxFlowElement, MdxJsxTextElement } from 'mdast-util-mdx';
import { visit } from './visit';

export type MdxJsxElement = MdxJsxFlowElement | MdxJsxTextElement;

export function findAllJsxElements(root: Root, withXHTML = false): MdxJsxElement[] {
  const result: MdxJsxElement[] = [];
  visit(root, isMdxJsxElement, (node) => {
    /**
     * Filter out (X)HTML elements: they are allowed in MDX, but start with
     * lower-case letters
     */
    if (withXHTML || isNotXHTML(node.name)) {
      result.push(node);
    }
  });
  return result;
}

export function isMdxJsxElement(node: unknown): node is MdxJsxElement {
  return (
    !!node &&
    ((node as MdxJsxFlowElement).type === 'mdxJsxFlowElement' ||
      (node as MdxJsxTextElement).type === 'mdxJsxTextElement')
  );
}

const XHTML_TAG = /^[a-z]+$/;

function isNotXHTML(name: string | null) {
  return !!name && !XHTML_TAG.test(name.charAt(0));
}
