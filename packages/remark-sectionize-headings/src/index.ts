import type { Plugin } from 'unified';

/**
 * Options for plugin remark-sectionize-headings, for details see
 * https://github.com/christian-hackyourshack/npm/tree/main/packages/remark-sectionize-headings
 */
export interface Options {
  /**
   * This option adds a class corresponding to the heading to the injected
   * section.
   *
   * - string <name>, e.g. `section` to add classes `section section--h1`, ...
   * - false to disable class addition completely
   * - default: true, adds classes `h1`, `h2`, ...
   */
  addClass?: boolean | string;
  /**
   * Heading levels to wrap into sections
   *
   * - e.g. `[ 2, 3 ]` for only levels 2 & 3
   * - default: all
   */
  levels: number[];
}

interface Node {
  type: string;
  children: Node[];
  name?: string;
  depth?: number;
  value?: string;
  data?: Record<string, unknown>;
}

/**
 * Wrap sections defined by Markdown headings into HTML `section` elements.
 *
 * @param options For configuration options, see https://github.com/christian-hackyourshack/npm/tree/main/packages/remark-sectionize-headings
 * @returns transformer function
 */
export const plugin: Plugin<[Partial<Options>], unknown> = (options = {}) => {
  const { levels, addClass = true } = options;
  function sectionize(node: Node, index: number, parent: Node) {
    // Usually the mdast is a flat list,
    // but you never know which plugins have worked on it before...
    // let's sectionize the children first, just in case.
    if (node.children && node.children.length > 0) {
      sectionize(node.children[0], 0, node);
    }

    // Only headings have depth 1..6
    const level = node.depth ?? 7;
    if (level < 7 && (!levels || levels.includes(level))) {
      const section: Node = {
        type: 'section',
        data: {
          hName: 'section',
          hProperties: addClass
            ? {
                class:
                  typeof addClass === 'boolean' //
                    ? `h${level}`
                    : `${addClass} ${addClass}--h${level}`,
              }
            : {},
        },
        children: [],
      };
      const childCount = countChildren(parent.children, index, level);
      section.children = parent.children.splice(index, childCount, section);
      if (section.children.length > 1) {
        // recursively sectionize cildren of the section (skip first heading)
        sectionize(section.children[1], 1, section);
      }
    }

    // sectionize next siblings
    const next = index + 1;
    if (parent.children.length > next) {
      sectionize(parent.children[next], next, parent);
    }
  }

  return function transformer(root: Node) {
    sectionize(root.children[0], 0, root);
  };
};

function countChildren(children: Node[], start: number, level: number) {
  let count = 1;
  for (; start + count < children.length; count++) {
    const child = children[start + count];
    // Heading level is smaller, i.e. bigger heading
    if (child.depth ?? 7 <= level) return count;
  }
  return count;
}

export default plugin;
