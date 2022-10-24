import { capitalize, shortHash, toCamelCase } from '@internal/utils';
import { createJsxElement, createProgram, isDirective, visitAsync } from 'm2dx-utils';
import type { BlockContent, Root } from 'mdast';
import { Export, Exports } from './Exports';

export async function componentDirectives(root: Root, files: string[]) {
  const exports = new Exports(files.reverse());
  //                                ^^^
  // We want the JSX exports in reverse order, i.e. bottom-up

  const imports: string[] = [];
  await visitAsync(root, isDirective, async (directive, parent, index) => {
    if (parent) {
      const found = await exports.find(directive.name);
      if (found) {
        const alias = getAlias(found.file, found.name);
        const tag = [alias, directive.name].join('.');
        const component = createJsxElement(`<${tag} />`);
        Object.keys(directive.attributes).forEach((key) => {
          component.attributes ??= [];
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
          root.children.push(createProgram(toImport(found, alias)));
        }
      }
    }
  });
}

function toImport({ file, name, isDefault }: Export, as: string): string {
  return isDefault //
    ? `import ${as} from '${file}';`
    : `import {${name} as ${as}} from '${file}'`;
}

function getAlias(file: string, name: string) {
  return capitalize(toCamelCase(`${name}__${shortHash(file)}`));
}
