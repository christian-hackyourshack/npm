import type { Identifier, Program, VariableDeclaration, VariableDeclarator } from 'estree';
import { EXIT as esEXIT, visit as esVisit } from 'estree-util-visit';
import type { Root } from 'mdast';
import { isVariableDeclarator } from '../utils/esm';
import { isMdxjsEsm } from '../utils/mdx';
import { EXIT, visit } from '../utils/mdx/visit';

/** Exported only for testing purposes */
export function findExportInMdx(root: Root): VariableDeclarator | undefined {
  let found: VariableDeclarator | undefined = undefined;
  visit(root, isMdxjsEsm, (node) => {
    if ((found = findExportInProgram(node.data!.estree!))) {
      return EXIT;
    }
  });
  return found;
}

function findExportInProgram(program: Program): VariableDeclarator | undefined {
  let found: VariableDeclarator | undefined = undefined;
  esVisit(program, (n, key, index, ancestors) => {
    if (isVariableDeclarator(n)) {
      const name = (n.id as Identifier).name;
      const declaration = ancestors[ancestors.length - 1] as VariableDeclaration;
      if (name === 'components' && declaration.kind === 'const') {
        found = n;
        return esEXIT;
      }
    }
  });
  return found;
}
