import { capitalize, shortHash, toCamelCase, toLinux } from '@internal/utils';
import { createProgram } from 'm2dx-utils';
import type { Root } from 'mdast';
import { Export, Exports } from '../Exports';
import { findUnresolved } from './findUnresolved';

export async function autoImports(root: Root, files: string[], failUnresolved = false) {
  // TODO: Align this implementation with componentDirectives
  const unresolved = findUnresolved(root);
  if (unresolved.length === 0) return;
  const exports = new Exports(files.reverse(), isJsxName);
  //                                      ^^^
  // We want the JSX exports in reverse order, i.e. bottom-up

  const imports: string[] = [];
  for (const u of unresolved) {
    const e = await exports.find(u.name);
    if (e) {
      const alias = capitalize(toCamelCase(`${e.name}__${shortHash(e.file)}`));
      u.name = `${alias}.${u.name}`;
      if (!imports.includes(alias)) {
        imports.push(alias);
        root.children.push(createProgram(toImport(e, alias)));
      }
    } else if (failUnresolved) {
      throw new Error(
        `JSX component <${u.name}> cannot be resolved, please import it explicitly in your MDX file or add an autoImport with astro-m2dx, see https://astro-m2dx.netlify.app/options/auto-imports how to do that`
      );
    }
  }
}

function toImport({ file, name, isDefault }: Export, alias: string): string {
  return isDefault //
    ? `import ${alias} from '${toLinux(file)}';`
    : `import {${name} as ${alias}} from '${toLinux(file)}'`;
}

const CAPITAL_LETTER = /[A-Z]/;
function isJsxName(name: string): boolean {
  return !!name && name.length > 0 && CAPITAL_LETTER.test(name.charAt(0));
}
