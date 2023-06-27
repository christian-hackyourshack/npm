import { parseEsm, isExportNamedDeclaration } from "@internal/estree-util";
import { readFileSync } from "fs";
import { join, dirname } from "path";

const exportsPerDir = new Map<string, Export[]>();
export function findExports(dir: string | undefined, componentsFile: string): Export[] {
  dir ??= process.cwd();
  if (exportsPerDir.has(dir)) return exportsPerDir.get(dir)!;

  const exports: Export[] = [];
  try {
    const file = join(dir, componentsFile);
    const src = readFileSync(file, 'utf8');
    const { body } = parseEsm(src);
    body.filter(isExportNamedDeclaration).forEach((d) => {
      d.specifiers.forEach((s) => {
        exports.push({
          file,
          name: s.exported.name,
        });
      });
    });
  } catch (e) {
    // do nothing
  }
  if (dir !== process.cwd()) {
    exports.push(...findExports(dirname(dir), componentsFile));
  }
  exportsPerDir.set(dir, exports);
  return exports;
}

export interface Export {
  file: string;
  name: string;
}
