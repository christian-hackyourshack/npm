import type { Root } from 'mdast';
import { findAllImportSpecifiers, findAllJsxElements } from '../utils/mdx';

export function findUnresolved(root: Root) {
  const imports = findAllImportSpecifiers(root).map((i) => i.name);
  const elements = findAllJsxElements(root);
  return elements.filter((n) => !imports.includes(n.name ?? ''));
}
