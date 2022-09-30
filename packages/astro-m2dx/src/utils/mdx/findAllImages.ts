import type { Image, Root } from 'mdast';
import type { Parent } from 'unist';
import { visit, type Test } from 'unist-util-visit';

export type FoundImage = [Image, Parent];

export function findAllImages(root: Root) {
  const result: FoundImage[] = [];
  visit(root, 'image' as Test, (node, index, parent) => {
    result.push([node as Image, parent as Parent]);
  });
  return result;
}
