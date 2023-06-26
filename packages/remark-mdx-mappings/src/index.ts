import { ObjectExpression, Program, SpreadElement, VariableDeclarator, createProgram, isExportNamedDeclaration, isIdentifier, isObjectExpression, isVariableDeclaration, isVariableDeclarator, parseEsm } from "@internal/estree-util";
import type { Root } from "@internal/mdast-util";
import { isMdxjsEsm } from "@internal/mdast-util-mdx";
import { toLinux } from "@internal/utils";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { EXIT, visit } from "pre-visit";
/**
 * Options for plugin remark-mdx-mappings, for details see
 * https://github.com/christian-hackyourshack/npm/tree/main/packages/remark-mdx-mappings
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
  return (root: Root, { dirname }: { dirname?: string }) => {
    const mappings = findMappings(dirname, componentsFile);
    if (mappings.length === 0) return;

    const imports = mappings.map((file, i) =>
      `import { components as _components${i} } from '${toLinux(file)}'`)
      .join('\n');
    root.children.push(createProgram(imports));

    const found = findMappingInMdx(root);
    if (found) {
      const init = found.init! as ObjectExpression;
      init.properties = [
        ...mappings.map((_, i) => {
          return {
            type: 'SpreadElement',
            argument: {
              type: 'Identifier',
              name: `_components${i}`
            }
          } as SpreadElement
        }),
        ...init.properties,
      ];
    } else {
      const src = `export const components = { ${mappings.map((_, i) => `..._components${i}`).join(', ')} };`;
      root.children.push(createProgram(src));
    }
  };
};



const mappingsPerDir = new Map<string, string[]>();
function findMappings(dir: string | undefined, componentsFile: string): string[] {
  dir ??= process.cwd();
  if (mappingsPerDir.has(dir)) return mappingsPerDir.get(dir)!;

  const mappings: string[] = [];
  try {
    const file = join(dir, componentsFile);
    const src = readFileSync(file, 'utf8');
    const program = parseEsm(src);
    if (findMapping(program)) {
      mappings.push(file);
    }
  } catch (e) {
    // do nothing
  }
  if (dir !== process.cwd()) {
    mappings.push(...findMappings(dirname(dir), componentsFile));
  }
  mappingsPerDir.set(dir, mappings);
  return mappings;
}

function findMappingInMdx(root: unknown): VariableDeclarator | undefined {
  let found: VariableDeclarator | undefined = undefined;
  visit(root, isMdxjsEsm, (node) => {
    if ((found = findMapping(node.data!.estree!))) {
      return EXIT;
    }
  });
  return found;
}

export function findMapping({ body }: Program): VariableDeclarator | undefined {
  for (const e of body.filter(isExportNamedDeclaration)) {
    const d = e.declaration;
    if (isVariableDeclaration(d) && d.kind === 'const') {
      for (const v of d.declarations.filter(isVariableDeclarator)) {
        const id = v.id;
        if (isIdentifier(id) && id.name === 'components' && isObjectExpression(v.init)) {
          return v;
        }
      }
    }
  }
  return undefined;
}
