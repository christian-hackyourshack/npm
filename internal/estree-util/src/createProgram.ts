import type { MdxjsEsm } from 'mdast-util-mdx';
import { parseEsm } from './parseEsm';

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
