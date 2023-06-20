import type { Content, Node, Parent } from ".";

interface Directive extends Parent {
  name: string;
  attributes: Record<string, string>;
  children: Content[];
}

export interface ContainerDirective extends Directive {
  type: 'containerDirective';
}

export function isContainerDirective(node: unknown): node is ContainerDirective {
  return !!node && (node as ContainerDirective).type === 'containerDirective';
}

export interface LeafDirective extends Directive {
  type: 'leafDirective';
}

export function isLeafDirective(node: unknown): node is LeafDirective {
  return !!node && (node as LeafDirective).type === 'leafDirective';
}

export interface TextDirective extends Directive {
  type: 'textDirective';
}

export function isTextDirective(node: unknown): node is TextDirective {
  return !!node && (node as TextDirective).type === 'textDirective';
}

export function isDirective(node: unknown): node is Directive {
  if (!node) return false;
  const type = (node as Node).type;
  switch (type) {
    case 'containerDirective':
    case 'leafDirective':
    case 'textDirective':
      return true;
    default:
      return false;
  }
}
