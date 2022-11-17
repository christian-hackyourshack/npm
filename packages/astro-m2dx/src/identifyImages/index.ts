import { fillDigits } from '@internal/utils';
import { getHProperties, isImage, visit } from 'm2dx-utils';
import type { Root } from 'mdast';

export function identifyImages(root: Root, prefix = 'img_', digits = 3): void {
  let imageCount = 0;
  visit(root, isImage, (node) => {
    getHProperties(node).id ??= `${prefix}${fillDigits(imageCount++, digits)}`;
  });
}
