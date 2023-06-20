import { createProgram, isExportNamedDeclaration, isImportDeclaration, parseEsm } from "@internal/estree-util";
import { MdxJsxFlowElement, MdxJsxTextElement, isMdxJsxFlowElement, isMdxJsxTextElement, isMdxjsEsm } from "@internal/mdast-util-mdx";
import { toLinux } from "@internal/utils";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { visit } from "pre-visit";
/**
 * Options for plugin remark-importless-jsx, for details see
 * https://github.com/christian-hackyourshack/npm/tree/main/packages/remark-importless-jsx
 */
export interface Options {
  /**
   * Name of the file that defines the pre-defined exports
   *
   * - default: '_components.ts'
   */
  file?: string;
}

export default function (options: Options = {}) {
  const { file: componentsFile = '_components.ts' } = options;
  return (root: unknown, { dirname }: { dirname?: string }) => {
    const unresolved = findUnresolved(root);
    if (unresolved.length === 0) return;

    const exports = findExports(dirname, componentsFile);
    const imports: string[] = [];
    for (const u of unresolved) {
      const e = exports.find((e) => e.name === u.name);
      if (e) {
        if (!imports.includes(e.name)) {
          imports.push(e.name);
          const importStatement = `import { ${e.name} } from '${toLinux(e.file)}'`;
          (root as Parent).children.push(createProgram(importStatement));
        }
      } else {
        console.warn(
          `JSX component <${u.name}> [] cannot be resolved, please import it explicitly in your MDX file or add an export to '${componentsFile}'`
        );
      }
    }
  };
};

function findUnresolved(root: unknown) {
  const imports = findAllImportSpecifiers(root).map((i) => i.name);
  const elements = findAllJsxElements(root);
  return elements.filter((n) => !imports.includes(n.name ?? ''));
}

function findAllImportSpecifiers(root: unknown) {
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

interface ImportSpecifier {
  name: string;
  source: string;
  isDefault: boolean;
}

function findAllJsxElements(root: unknown): MdxJsxElement[] {
  const result: MdxJsxElement[] = [];
  visit(root, isMdxJsxElement, (node) => {
    result.push(node);
  });
  return result;
}

type MdxJsxElement = MdxJsxFlowElement | MdxJsxTextElement;

const JSX_TAG = /^[A-Z]\w+/;
function isMdxJsxElement(node: unknown): node is MdxJsxElement {
  return (
    !!node &&
    (isMdxJsxFlowElement(node) || isMdxJsxTextElement(node)) &&
    JSX_TAG.test(node.name || '')
  );
}

const exportsPerDir = new Map<string, Export[]>();
function findExports(dir: string | undefined, componentsFile: string): Export[] {
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

interface Parent {
  children: unknown[];
}

interface Export {
  file: string;
  name: string;
}
