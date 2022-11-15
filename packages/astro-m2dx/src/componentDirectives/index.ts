import { capitalize, shortHash, toCamelCase, toLinux } from '@internal/utils';
import { createJsxElement, createProgram, isDirective, visitAsync } from 'm2dx-utils';
import type { BlockContent, Root } from 'mdast';
import { Export, Exports } from '../Exports';

export async function componentDirectives(root: Root, files: string[]) {
  const exports = new Exports(files.reverse());
  //                                ^^^
  // We want the JSX exports in reverse order, i.e. bottom-up

  const imports: string[] = [];
  await visitAsync(root, isDirective, async (directive, parent, index) => {
    if (parent) {
      const e = await exports.find(directive.name);
      if (e) {
        const alias = capitalize(toCamelCase(`${e.name}__${shortHash(e.file)}`));
        const component = createJsxElement(`<${alias}.${directive.name} />`);
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
          root.children.push(createProgram(toImport(e, alias)));
        }
      }
    }
  });
}

function toImport({ file, name, isDefault }: Export, as: string): string {
  return isDefault //
    ? `import ${as} from '${toLinux(file)}';`
    : `import {${name} as ${as}} from '${toLinux(file)}'`;
}
