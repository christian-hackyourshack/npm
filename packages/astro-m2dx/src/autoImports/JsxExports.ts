import type { Identifier, Program, VariableDeclaration } from 'estree';
import { EXIT, visit } from 'estree-util-visit';
import { readFile } from 'fs/promises';
import {
  isExportDefaultDeclaration,
  isIdentifier,
  isObjectExpression,
  isProperty,
  isVariableDeclarator,
  parseEsm,
} from 'm2dx-utils';

export interface JsxExport {
  file: string;
  as: string;
  name: string;
  isDefault: boolean;
  components: string[];
}

export class JsxExports {
  readonly parsed: Record<string, JsxExport[]> = {};
  exportCount = 0;

  constructor(private files: string[]) {}

  async find(name: string | null): Promise<JsxExport | null> {
    if (!name) return null;

    for (const file of this.files) {
      let parsed = this.parsed[file];
      if (!parsed) {
        const src = await readFile(file, 'utf8');
        parsed = parseJsxExports(src).map((p) => {
          return { ...p, file, as: `AutoImport${(this.exportCount = this.exportCount + 1)}` };
        });
        this.parsed[file] = parsed;
      }
      const found = parsed.find((e) => e.components.includes(name));
      if (found) {
        return found;
      }
    }
    return null;
  }
}

export function parseJsxExports(src: string): Omit<JsxExport, 'file' | 'as'>[] {
  const root = parseEsm(src);
  const defaultExport = findDefaultExport(root);
  return findDeclarators(root, defaultExport);
}

function findDefaultExport(root: Program): string | undefined {
  let name: string | undefined = undefined;
  visit(root, (n) => {
    if (isExportDefaultDeclaration(n)) {
      name = (n.declaration as { name: string }).name;
      return EXIT;
    }
  });
  return name;
}

function findDeclarators(root: Program, defaultExport?: string): Omit<JsxExport, 'file' | 'as'>[] {
  const result: Omit<JsxExport, 'file' | 'as'>[] = [];
  visit(root, (n, k, i, ancestors) => {
    if (isVariableDeclarator(n)) {
      const declaration = ancestors[ancestors.length - 1] as VariableDeclaration;
      const init = n.init;
      if (declaration.kind === 'const' && isObjectExpression(init)) {
        const name = (n.id as Identifier).name;
        const isDefault = name === defaultExport;
        if (isDefault || ancestors[ancestors.length - 2].type === 'ExportNamedDeclaration') {
          const components = init.properties
            .filter(isProperty)
            .map((p) => p.key)
            .filter(isIdentifier)
            .map((i) => i.name)
            .filter(isJsxName);
          if (components.length > 0) {
            result.push({
              name,
              components,
              isDefault,
            });
          }
        }
      }
    }
  });
  return result;
}

const CAPITAL_LETTER = /[A-Z]/;
function isJsxName(name: string): boolean {
  return !!name && name.length > 0 && CAPITAL_LETTER.test(name.charAt(0));
}
