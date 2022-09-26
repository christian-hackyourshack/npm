import type { Root } from 'mdast';
import type { MdxjsEsm } from 'mdast-util-mdx';
import { visit } from 'unist-util-visit';
import { isImportDeclaration } from '../esm';

export interface ImportSpecifier {
  name: string;
  source: string;
  isDefault: boolean;
}

export function findAllImportSpecifiers(root: Root) {
  const result: ImportSpecifier[] = [];
  visit(root, 'mdxjsEsm', (node: MdxjsEsm) => {
    const body = node.data?.estree?.body;
    if (body) {
      body.filter(isImportDeclaration).forEach((d) => {
        const source = d.source.value as string;
        d.specifiers.forEach((s) => {
          result.push({
            name: s.local.name,
            source,
            isDefault: s.type === 'ImportDefaultSpecifier',
          });
        });
      });
    }
  });
  return result;
}
