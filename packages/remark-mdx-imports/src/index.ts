import { createProgram, isImportDeclaration } from "@internal/estree-util";
import { Directive, Node, isDirective } from "@internal/mdast-util";
import { MdxJsxAttribute, MdxJsxFlowElement, MdxJsxTextElement, isMdxJsxFlowElement, isMdxJsxTextElement, isMdxjsEsm } from "@internal/mdast-util-mdx";
import { toLinux } from "@internal/utils";
import { visit } from "pre-visit";
import { Export, findExports } from "./findExports";
/**
 * Options for plugin remark-mdx-imports, for details see
 * https://github.com/christian-hackyourshack/npm/tree/main/packages/remark-mdx-imports
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
    const elements = findMdxJsxElements(root);
    const directives = findJsxDirectives(root);
    if (elements.length === 0 && directives.length === 0) return;

    const newImports = new Set<Export>();
    const imports = findImports(root);
    let exports: Export[] | undefined;

    for (const unresolved of elements.filter((e) => !imports.includes(e))) {
      exports ??= findExports(dirname, componentsFile);
      const found = exports.find((e) => e.name === unresolved);
      if (found) {
        newImports.add(found);
      } else {
        console.warn(
          `JSX component <${unresolved}> [] cannot be resolved, please import it explicitly in your MDX file or add an export to '${componentsFile}'`
        );
      }
    }

    for (const node of directives) {
      let found: true | Export | undefined;
      if (imports.includes(node.name)) {
        found = true;
      } else {
        exports ??= findExports(dirname, componentsFile);
        found = exports.find((e) => e.name === node.name);
        if (found) {
          newImports.add(found);
        }
      }
      if (found) {
        transformDirectiveToComponent(node);
      }
    }

    for (const e of newImports) {
      const newImport = `import { ${e.name} } from '${toLinux(e.file)}'`;
      (root as { children: unknown[] }).children.push(createProgram(newImport));
    }
  };
};


function findImports(root: unknown) {
  const result: string[] = [];
  visit(root, isMdxjsEsm, (node) => {
    node.data?.estree?.body?.filter(isImportDeclaration).forEach((decl) => {
      decl.specifiers.forEach((s) => {
        result.push(s.local.name);
      });
    });
  });
  return result;
}

function findMdxJsxElements(root: unknown) {
  const result = new Set<string>();
  visit(root, isMdxJsxElement, (node) => {
    result.add(node.name!);
  });
  return [...result];
}

type MdxJsxElement = MdxJsxFlowElement | MdxJsxTextElement;

function isMdxJsxElement(node: unknown): node is MdxJsxElement {
  return (
    !!node &&
    (isMdxJsxFlowElement(node) || isMdxJsxTextElement(node)) &&
    isJsxTag(node.name)
  );
}

const JSX_TAG = /^[A-Z]\w+/;
function isJsxTag(name?: string | null) {
  return JSX_TAG.test(name || '');
}

function findJsxDirectives(root: unknown): Directive[] {
  const result: Directive[] = [];
  visit(root, isDirective, (node) => {
    if (isJsxTag(node.name)) {
      result.push(node);
    }
  });
  return result;
}

function transformDirectiveToComponent(node: Directive) {
  const transformed = node as Node;
  transformed.type = 'mdxJsxFlowElement';
  const attributes: MdxJsxAttribute[] = [];
  Object.keys(node.attributes).forEach((key) => {
    attributes.push({
      type: 'mdxJsxAttribute',
      name: key,
      value: node.attributes[key],
    });
  });
  transformed.attributes = attributes;
}
