import { createProgram } from "@internal/estree-util";
import { addHClasses, setHName } from "@internal/hast-util";
import { Content, Node, Root, Text, isLeafDirective } from "@internal/mdast-util";
import { createJsxElement } from "@internal/mdast-util-mdx";
import { toLinux } from "@internal/utils";
import { join } from "path";
import { SKIP, visit } from "pre-visit";
/**
 * Options for plugin remark-mdx-imports, for details see
 * https://github.com/christian-hackyourshack/npm/tree/main/packages/remark-mdx-imports
 */
export interface Options {
  /**
   * Name of the directive to include other files
   *
   * - default: 'include'
   */
  name?: string;
}

export default function (options: Options = {}) {
  const { name: directiveName = 'include' } = options;
  return (root: unknown, { path, dirname }: { path: string, dirname?: string }) => {
    if (!dirname) return;

    let count = 0;
    visit(root, isLeafDirective, (directive, parent, index, ancestors) => {
      if (parent && directive.name === directiveName) {
        const ref = (directive.children[0] as Text)?.value;
        if (!ref) {
          console.warn(`::${directiveName} directive without [ref] attribute in ${path}`);
          return SKIP;
        }
        const name = `Include__${count++}`;
        const file = toLinux(join(dirname, ref));
        const importElement =
          createProgram(`import * as ${name} from '${file}';`);
        (root as Root).children.push(importElement);

        let included: Node = createJsxElement(
          `<${name}.Content components={${name}.components ?? {}} />`
        );
        const classes = directive.attributes['class'];
        if (classes) {
          setHName(directive, 'div');
          addHClasses(directive, directive.attributes.class);
          directive.children = [included as Content];
          included = directive;
        }

        if (Object.keys(directive.attributes).includes('unwrap') && ancestors.length > 1) {
          const target = ancestors[1];
          const position = target.children.indexOf(parent) + 1;
          target.children.splice(position, 0, included);
          parent.children.splice(index, 1);
        } else {
          parent.children[index] = included;
        }
      }
    });
  };
};
