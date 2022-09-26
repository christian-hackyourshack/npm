import type { MdxjsEsm } from 'mdast-util-mdx';
import { parseEsm } from '../esm';

export function createProgram(value: string): MdxjsEsm {
  const estree = parseEsm(value);
  return {
    type: 'mdxjsEsm',
    value,
    data: {
      estree,
    },
  };
}
