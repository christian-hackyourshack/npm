import { deepMerge, exists, normalizeAll, type ObjectLike } from '@internal/utils';
import { readFile } from 'fs/promises';
import grayMatter from 'gray-matter';
import YAML from 'js-yaml';
import { isHeading } from 'mdast-typeguards';
import { toString } from 'mdast-util-to-string';
import { dirname, join, normalize } from 'path';
import { EXIT, visit } from 'pre-visit';
import type { VFile as _VFile, Data } from 'vfile';
/**
 * Options for plugin remark-normalize-paths, for details see
 * https://github.com/christian-hackyourshack/npm/tree/main/packages/remark-normalize-paths
 */
export interface Options {
  /**
   * Name of the file that defines the pre-defined exports
   *
   * - default: '_components.ts'
   */
  file?: string;

  /**
   * Resolve relative paths from the merged frontmatter file with respect to 
   * that file.
   */
  resolvePaths?: boolean;

  /**
   * Add a `title` field to the frontmatter. The title is the first top-level
   * heading in the markdown file `# Title`.
   */
  title?: boolean;

  /**
   * List of functions to transform the frontmatter.
   */
  transform?: Transform[];
}

export type Transform = (frontmatter: ObjectLike, vfile: VFile) => void | Promise<void>;

interface VFile extends _VFile {
  data: Data & {
    astro?: {
      frontmatter?: ObjectLike
    }
  }
}

export default function ({
  file = '_frontmatter.yaml',
  resolvePaths = false,
  title = false,
  transform
}: Options = {}) {
  return async (root: unknown, vfile?: VFile) => {
    if (!vfile || !vfile.path) return;

    // read the original frontmatter from the file
    const originalSource = await readFile(vfile.path, 'utf8');
    let { data: frontmatter } = grayMatter(originalSource);

    // just in case Astro starts to insert any extra frontmatter at some point
    // (at the moment the received astro.frontmatter is always an empty object)
    if (vfile.data?.astro?.frontmatter) {
      frontmatter = deepMerge(frontmatter, vfile.data.astro.frontmatter);
    }

    let dir = vfile?.dirname;
    if (dir) {
      dir = normalize(dir);
      const stop = process.cwd();
      if (!dir.startsWith(stop)) {
        throw new Error(`[remark-enhance-frontmatter] vfile.dirname must be a subdirectory of process.cwd(), but ${dir} is not a subdirectory of ${stop}`);
      }
      const common = await readCommon(dir, file, dir, stop, undefined, resolvePaths);
      if (common) {
        frontmatter = deepMerge(common, frontmatter);
      }
    }
    if (title) {
      frontmatter.title ??= scanTitle(root);
    }
    if (transform) {
      transform.forEach((fn) => fn(frontmatter, vfile));
    }
    if (Object.keys(frontmatter).length > 0) {
      ((vfile.data ??= {}).astro ??= {}).frontmatter = frontmatter;
    }
  };
};

async function readCommon(
  targetDir: string,
  name: string,
  dir: string,
  stop: string,
  previous: ObjectLike | undefined,
  resolvePaths = false
): Promise<ObjectLike | undefined> {
  const file = join(dir, name);
  if (await exists(file)) {
    const yaml = await readFile(file, 'utf8');
    let current = YAML.load(yaml) as ObjectLike;
    if (resolvePaths) {
      current = normalizeAll(current, dirname(file), targetDir);
    }
    if (previous) {
      previous = deepMerge(current, previous);
    } else {
      previous = current;
    }
  }
  if (dir === stop) {
    return previous;
  }
  return await readCommon(targetDir, name, dirname(dir), stop, previous, resolvePaths);
}

function scanTitle(root: unknown): string | undefined {
  let title: string | undefined;
  visit(root, isHeading, (node) => {
    if (node.depth === 1) {
      title = toString(node);
      return EXIT;
    }
  });
  return title;
}
