import type { Node } from "@internal/mdast-util";
import type { MdxFlowExpression, MdxJsxAttribute, MdxJsxAttributeValueExpression, MdxJsxExpressionAttribute, MdxJsxFlowElement, MdxJsxTextElement, MdxTextExpression, MdxjsEsm } from ".";

export function isMdxFlowExpression(node: unknown): node is MdxFlowExpression {
  return !!node && (node as Node).type === 'mdxFlowExpression';
}
export function isMdxJsxAttribute(node: unknown): node is MdxJsxAttribute {
  return !!node && (node as Node).type === 'mdxJsxAttribute';
}
export function isMdxJsxAttributeValueExpression(node: unknown): node is MdxJsxAttributeValueExpression {
  return !!node && (node as Node).type === 'mdxJsxAttributeValueExpression';
}
export function isMdxJsxExpressionAttribute(node: unknown): node is MdxJsxExpressionAttribute {
  return !!node && (node as Node).type === 'mdxJsxExpressionAttribute';
}
export function isMdxJsxFlowElement(node: unknown): node is MdxJsxFlowElement {
  return !!node && (node as Node).type === 'mdxJsxFlowElement';
}
export function isMdxJsxTextElement(node: unknown): node is MdxJsxTextElement {
  return !!node && (node as Node).type === 'mdxJsxTextElement';
}
export function isMdxTextExpression(node: unknown): node is MdxTextExpression {
  return !!node && (node as Node).type === 'mdxTextExpression';
}
export function isMdxjsEsm(node: unknown): node is MdxjsEsm {
  return !!node && (node as Node).type === 'mdxjsEsm';
}
