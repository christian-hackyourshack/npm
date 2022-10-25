import { isObjectLike } from '@internal/utils';
import type { Root } from 'mdast';
import { remark } from 'remark';
import remarkDirective from 'remark-directive';
import remarkMdx from 'remark-mdx';

export function parseMdx(mdx: string): Root {
  return remark().use(remarkMdx).use(remarkDirective).parse(mdx);
}

export function parseDirectives(mdx: string): Root {
  return remark().use(remarkDirective).parse(mdx);
}

export function parseMd(mdx: string): Root {
  return remark().parse(mdx);
}

export function deletePositions(root: unknown) {
  if (isObjectLike(root)) {
    Object.keys(root).forEach((k) => {
      const value = root[k];
      if (Array.isArray(value)) {
        value.forEach((item) => deletePositions(item));
      } else if (isObjectLike(value)) {
        if (k === 'position') {
          delete root.position;
        } else {
          deletePositions(value);
        }
      }
    });
  }
}
