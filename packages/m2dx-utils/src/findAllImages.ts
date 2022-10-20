import type { Image, Parent, Root } from 'mdast';
import { isImage } from './mdast';
import { visit } from './visit';

export type FoundImage = [Image, Parent];

export function findAllImages(root: Root) {
  const result: FoundImage[] = [];
  visit(root, isImage, (node, parent) => {
    result.push([node as Image, parent as Parent]);
  });
  return result;
}
