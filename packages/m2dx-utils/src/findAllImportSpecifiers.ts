import type { Root } from 'mdast';
import { isImportDeclaration } from './estree';
import { isMdxjsEsm } from './mdast';
import { visit } from './visit';

export interface ImportSpecifier {
  name: string;
  source: string;
  isDefault: boolean;
}

export function findAllImportSpecifiers(root: Root) {
  const result: ImportSpecifier[] = [];
  visit(root, isMdxjsEsm, (node) => {
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
