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
   * - default: undefined, i.e. all
   */
  levels?: number[];
}

export default function (options: Options = {}) {
  const { levels, addClass = true } = options;
  return (root: Node) => {
    if (isParent(root)) {
      _sectionize(root.children[0], 0, root);
    }
  };

  function _sectionize(node: Node, index: number, parent: Parent) {
    // Usually the mdast is a flat list,
    // but you never know which plugins have worked on it before...
    // let's sectionize the children first, just in case.
    if (isParent(node)) {
      _sectionize(node.children[0], 0, node);
    }
    // Only headings have depth 1..6
    const level = node.depth ?? 7;
    if (level < 7 && (!levels || levels.includes(level))) {
      const section: Parent = {
        type: 'section',
        data: {
          hName: 'section',
          hProperties: addClass
            ? { class: getClass(addClass, level) }
            : {},
        },
        children: [],
      };
      const childCount = countChildren(parent.children, index, level);
      section.children = parent.children.splice(index, childCount, section);
      if (section.children.length > 1) {
        // recursively sectionize cildren of the section (skip first heading)
        _sectionize(section.children[1], 1, section);
      }
    }

    // sectionize next siblings
    const next = index + 1;
    if (parent.children.length > next) {
      _sectionize(parent.children[next], next, parent);
    }
  }
};

interface Node {
  type: string;
  depth?: number;
  data?: Record<string, unknown>;
}

interface Parent extends Node {
  children: Node[];
}

function isParent(node: unknown): node is Parent {
  return (
    Object.keys(node as Parent).includes('children') &&
    Array.isArray((node as Parent).children) &&
    (node as Parent).children.length > 0
  );
}

/**
 * Wrap sections defined by Markdown headings into HTML `section` elements.
 *
 * @param options For configuration options, see https://github.com/christian-hackyourshack/npm/tree/main/packages/remark-sectionize-headings
 * @returns transformer function
 */


function getClass(addClass: boolean | string, level: number) {
  return (typeof addClass === 'boolean' //
    ? `h${level}`
    : `${addClass} ${addClass}--h${level}`);
}

function countChildren(children: Node[], start: number, level: number) {
  let count = 1;
  for (; start + count < children.length; count++) {
    const child = children[start + count];
    // Heading level is smaller, i.e. bigger heading
    if ((child.depth ?? 7) <= level) return count;
  }
  return count;
}
