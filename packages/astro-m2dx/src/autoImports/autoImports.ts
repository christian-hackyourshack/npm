import type { Root } from 'mdast';
import { findUnresolved } from './findUnresolved';
import { autoImport, JsxExports } from './JsxExports';

export async function autoImports(root: Root, files: string[]) {
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
          root.children.push(autoImport(jsxExport));
        }
      }
      return;
    })
  );
}
