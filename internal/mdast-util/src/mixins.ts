import type { Alternative, Association, Node, Reference, Resource } from '.';

export function isAlternative(node: unknown): node is Alternative {
  if (!node) return false;
  switch ((node as Node).type) {
    case 'image':
    case 'imageReference':
      return true;
    default: return false;
  }
}

export function isAssociation(node: unknown): node is Association {
  if (!node) return false;
  switch ((node as Node).type) {
    case 'definition':
    case 'footnoteDefinition':
    case 'footnoteReference':
    case 'reference':
      return true;
    default: return false;
  }
}
export function isReference(node: unknown): node is Reference {
  if (!node) return false;
  switch ((node as Node).type) {
    case 'definition':
    case 'footnoteDefinition':
    case 'footnoteReference':
    case 'imageReference':
    case 'linkReference':
    case 'reference':
      return true;
    default: return false;
  }
}

export function isResource(node: unknown): node is Resource {
  if (!node) return false;
  switch ((node as Node).type) {
    case 'definition':
    case 'image':
    case 'link':
      return true;
    default: return false;
  }
}
