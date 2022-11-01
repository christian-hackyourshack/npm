import { toLinux } from '@internal/utils';
import type { ObjectExpression } from 'estree';
import { createProgram } from 'm2dx-utils';
import type { Root } from 'mdast';
import { findExportInMdx } from './findExportInMdx';

export function exportComponents(root: Root, files: string[]) {
  const imports = files
    .map((f, i) => `import { components as _ac${i} } from '${toLinux(f)}';`)
    .join('\n');
  root.children.push(createProgram(imports));

  const found = findExportInMdx(root);
  if (found) {
    const init = found.init! as ObjectExpression;
    for (let i = 0; i < files.length; i++) {
      init.properties = [
        { type: 'SpreadElement', argument: { type: 'Identifier', name: `_ac${i}` } },
        ...init.properties,
      ];
    }
  } else {
    const src = `export const components = {${files.map((_, i) => `..._ac${i}`).join(',')}};`;
    root.children.push(createProgram(src));
  }
}
