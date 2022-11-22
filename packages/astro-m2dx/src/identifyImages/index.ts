import { shortHash } from '@internal/utils';
import { getHProperties, isImage, visit } from 'm2dx-utils';
import type { Root } from 'mdast';
import { relative } from 'path';
import type { VFile } from 'vfile';

export function identifyImages(root: Root, file: VFile, prefix = 'img_'): void {
  const ids: string[] = [];
  visit(root, isImage, (node) => {
    const props = getHProperties(node);
    if (!props.id) {
      let id = node.alt ?? '' + ':' + node.url;
      while (ids.includes(id)) {
        id = id + '_';
      }
      ids.push(id);
      const data = {
        file: relative(process.cwd(), file.path),
        id,
      };
      props.id = `${prefix}${shortHash(data)}`;
    }
  });
}
