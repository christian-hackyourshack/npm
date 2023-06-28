import type { Literal, Node, Parent } from '.';

export function isLiteral(node: unknown): node is Literal {
  if (!node) return false;
  switch ((node as Node).type) {
    case 'code':
    case 'html':
    case 'inlineCode':
    case 'text':
    case 'yaml':
      return true;
    default: return false;
  }
}

export function isParent(node: unknown): node is Parent {
  if (!node) return false;
  switch ((node as Node).type) {
    case 'blockquote':
    case 'delete':
    case 'emphasis':
    case 'footnote':
    case 'footnoteDefinition':
    case 'heading':
    case 'link':
    case 'linkReference':
    case 'list':
    case 'listItem':
    case 'paragraph':
    case 'root':
    case 'strong':
    case 'table':
    case 'tableCell':
    case 'tableRow':
      return true;
    default: return false;
  }
}

