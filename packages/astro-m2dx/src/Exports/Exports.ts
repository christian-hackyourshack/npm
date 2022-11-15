import type {
  Expression,
  Identifier,
  PrivateIdentifier,
  Program,
  VariableDeclaration,
} from 'estree';
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

export interface Export {
  file: string;
  name: string;
  isDefault: boolean;
  identifiers: string[];
}

type NameFilter = (name: string) => boolean;

export class Exports {
  /** File name to array of Export elements */
  readonly exports: Record<string, Export[]> = {};

  constructor(private files: string[], private nameFilter: NameFilter = () => true) {}

  async find(name: string | null): Promise<Export | null> {
    if (!name) return null;

    for (const file of this.files) {
      let exports = this.exports[file];
      if (!exports) {
        const src = await readFile(file, 'utf8');
        exports = parseExports(src, this.nameFilter).map((p) => {
          return { ...p, file };
        });
        this.exports[file] = exports;
      }
      const found = exports.find((e) => e.identifiers.includes(name));
      if (found) {
        return found;
      }
    }
    return null;
  }
}

export function parseExports(src: string, predicate: NameFilter): Omit<Export, 'file'>[] {
  const root = parseEsm(src);
  const defaultExport = findDefaultExport(root);
  return findDeclarators(root, predicate, defaultExport);
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

function findDeclarators(
  root: Program,
  predicate: NameFilter,
  defaultExport?: string
): Omit<Export, 'file' | 'as'>[] {
  const result: Omit<Export, 'file'>[] = [];
  visit(root, (n, k, i, ancestors) => {
    if (isVariableDeclarator(n)) {
      const declaration = ancestors[ancestors.length - 1] as VariableDeclaration;
      const init = n.init;
      if (declaration.kind === 'const' && isObjectExpression(init)) {
        const name = (n.id as Identifier).name;
        const isDefault = name === defaultExport;
        if (isDefault || ancestors[ancestors.length - 2].type === 'ExportNamedDeclaration') {
          const identifiers = init.properties
            .filter(isProperty)
            .map((p) => p.key)
            .map((k) => getName(k))
            .filter(predicate);
          if (identifiers.length > 0) {
            result.push({
              name,
              identifiers,
              isDefault,
            });
          }
        }
      }
    }
  });
  return result;
}

function getName(key: Expression | PrivateIdentifier): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return isIdentifier(key) ? key.name : (key as any).value ?? `Unknown type for key: ${key.type}`;
}
