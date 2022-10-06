import type { BlockContent, Root } from 'mdast';
import { Export, Exports } from '../utils/esm/Exports';
import { createJsxElement, createProgram, isDirective, MdxjsEsm } from '../utils/mdx';
import { visit } from '../utils/mdx/visitAsync';
import { capitalize, toCamelCase } from '../utils/text/cases';
import { hash } from '../utils/text/hash';

export async function componentDirectives(root: Root, files: string[]) {
  const exports = new Exports(files.reverse());
  //                                ^^^
  // We want the JSX exports in reverse order, i.e. bottom-up

  const imports: string[] = [];
  await visit(root, isDirective, async (directive, parent, index) => {
    if (parent) {
      const found = await exports.find(directive.name);
      if (found) {
        const alias = getAlias(found.file, found.name);
        const tag = [alias, directive.name].join('.');
        const component = createJsxElement(`<${tag} />`);
        Object.keys(directive.attributes).forEach((key) => {
          component.attributes.push({
            type: 'mdxJsxAttribute',
            name: key,
            value: directive.attributes[key],
          });
        });
        component.children = directive.children as BlockContent[];
        parent.children[index] = component;
        if (!imports.includes(alias)) {
          imports.push(alias);
          root.children.push(createImport(found, alias));
        }
      }
    }
  });
}

function createImport({ file, name, isDefault }: Export, as: string): MdxjsEsm {
  const src = isDefault //
    ? `import ${as} from '${file}';`
    : `import {${name} as ${as}} from '${file}'`;
  return createProgram(src);
}

function getAlias(file: string, name: string) {
  return capitalize(toCamelCase(`${name}__${hash(file, 6)}`));
}
