import { toLinux } from '@internal/utils';
import { createProgram } from 'm2dx-utils';
import type { Root } from 'mdast';
import { findUnresolved } from './findUnresolved';
import { JsxExport, JsxExports } from './JsxExports';

export async function autoImports(root: Root, files: string[], failUnresolved = false) {
  // TODO: Align this implementation with componentDirectives
  const unresolved = findUnresolved(root);
  if (unresolved.length === 0) return;
  const jsxExports = new JsxExports(files.reverse());
  //                                      ^^^
  // We want the JSX exports in reverse order, i.e. bottom-up

  const appliedAutoImports: string[] = [];
  await Promise.all(
    unresolved.map(async (u) => {
      const jsxExport = await jsxExports.find(u.name);
      if (jsxExport) {
        u.name = `${jsxExport.as}.${u.name}`;
        if (!appliedAutoImports.includes(jsxExport.as)) {
          appliedAutoImports.push(jsxExport.as);
          root.children.push(createProgram(toImport(jsxExport)));
        }
      } else if (failUnresolved) {
        throw new Error(
          `JSX component <${u.name}> cannot be resolved, please import it explicitly in your MDX file or add an autoImport with astro-m2dx, see https://astro-m2dx.netlify.app/options/auto-imports how to do that`
        );
      }
    })
  );
}

function toImport({ file, as, name, isDefault }: JsxExport): string {
  return isDefault //
    ? `import ${as} from '${toLinux(file)}';`
    : `import {${name} as ${as}} from '${toLinux(file)}'`;
}
