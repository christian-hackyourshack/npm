import type { Root } from 'mdast';
import { join } from 'path';
import type { Plugin } from 'unified';
import { autoImports } from './autoImports';
import { exportComponents } from './exportComponents/exportComponents';
import { mergeFrontmatter } from './mergeFrontmatter';
import { relativeImages } from './relativeImages/relativeImages';
import { scanTitleAndAbstract } from './scanTitleAndAbstract';
import type { VFile } from './types/VFile';
import { deepMerge } from './utils/deepMerge';
import { findUpAll } from './utils/fs';

const DEFAULT_FRONTMATTER = '_frontmatter.yaml';
const DEFAULT_RAW_MDX = false;
const DEFAULT_MDAST = false;
const DEFAULT_SCAN_TITLE = false;
const DEFAULT_SCAN_ABSTRACT = false;
const DEFAULT_EXPORT_COMPONENTS = '_components.ts';
const DEFAULT_AUTO_IMPORTS = '_autoimports.ts';
const DEFAULT_RELATIVE_IMAGES = false;

/**
 * Options for plugin astro-m2dx, for details see
 * https://astro-m2dx.netlify.app/options
 */
export type Options = Partial<{
  /**
   * Merge YAML frontmatter files into the frontmatter.
   *
   * - false, to disable frontmatter merging
   * - name, to find frontmatter in YAML files with `name` up the directory tree
   * - default: `_frontmatter.yaml`
   */
  frontmatter: boolean | string;

  /**
   * Inject the raw MDX into the frontmatter.
   *
   * - true, to have it injected into property `rawmdx`
   * - name, to have it injected as property `<name>`
   * - default: `false`
   */
  rawmdx: boolean | string;

  /**
   * Inject the MD AST into the frontmatter.
   *
   * > NOTE: The injected tree is not read by the HTML generation,
   *   so manipulation does not make sense.
   *
   * - true, to have it injected into property `mdast`
   * - name, to have it injected as property `<name>`
   * - default: `false`
   */
  mdast: boolean | string;

  /**
   * Scan the content for the title and inject it into the frontmatter.
   *
   * The title will be taken from the first heading with depth=1,
   * i.e. the first line `# My Title`.
   *
   * - true, to have it injected into property `title`
   * - name, to have it injected as property `<name>`
   * - default: `false`
   *
   * If the frontmatter already has a property with that name, it will **NOT** be overwritten.
   */
  scanTitle: boolean | string;

  /**
   * Scan the content for the abstract and inject it into the frontmatter.
   *
   * The abstract will be taken from the content between the title and the next
   * heading. BEWARE: The content is raw MDX!
   *
   * - true, to have it injected into property `abstract`
   * - name, to have it injected as property `<name>`
   * - default: `false`
   *
   * If the frontmatter already has a property with that name, it will **NOT** be overwritten.
   */
  scanAbstract: boolean | string;

  /**
   * Auto-map HTML elements to JSX components: Name for component mapping files.
   *
   * - name, to find files with `name` up the directory tree
   * - false, to disable automatic component mapping
   * - default: `_components.ts`
   *
   * These files should be simple JavaScript/ESM files (i.e. ES >=6).
   */
  exportComponents: boolean | string;

  /**
   * Name for auto-import files.
   *
   * - name, to find files with `name` up the directory tree
   * - false, to disable automatic component mapping
   * - default: `_autoimports.ts`
   *
   * These files should be simple JavaScript/ESM files (i.e. ES >=6).
   */
  autoImports: boolean | string;

  /**
   * Flag to allow relative image references.
   *
   * All relative image references `![My alt text](my-image.png "Fancy Title")`
   * with a resolvable reference are replaced with an HTML <img /> tag with
   * the appropriate attributes, that uses an imported image reference as
   * `src`.
   *
   * - false, to disable relative image resolution
   * - default: false
   */
  relativeImages: boolean;
}>;

/**
 *  Astro M²DX Plugin
 *
 * @param options For configuration options, see https://astro-m2dx.netlify.app/options
 * @returns transformer function
 */
export const plugin: Plugin<[Options], unknown> = (options = {}) => {
  let {
    frontmatter: optFrontmatter = DEFAULT_FRONTMATTER,
    rawmdx: optRawmdx = DEFAULT_RAW_MDX,
    mdast: optMdast = DEFAULT_MDAST,
    scanTitle: optScanTitle = DEFAULT_SCAN_TITLE,
    scanAbstract: optScanAbstract = DEFAULT_SCAN_ABSTRACT,
    exportComponents: optExportComponents = DEFAULT_EXPORT_COMPONENTS,
    autoImports: optAutoImports = DEFAULT_AUTO_IMPORTS,
  } = options;
  const { relativeImages: optRelativeImages = DEFAULT_RELATIVE_IMAGES } = options;

  return async function transformer(root: Root, file: VFile) {
    // TODO: Read the frontmatter from the file
    let frontmatter = file.data.astro.frontmatter;

    if (optRawmdx) {
      if (typeof optRawmdx !== 'string') {
        optRawmdx = 'rawmdx';
      }
      if (!frontmatter[optRawmdx]) {
        frontmatter[optRawmdx] = file.value;
      }
    }

    if (optMdast) {
      if (typeof optMdast !== 'string') {
        optMdast = 'mdast';
      }
      if (!frontmatter[optMdast]) {
        frontmatter[optMdast] = root;
      }
    }

    if (optScanTitle || optScanAbstract) {
      if (optScanTitle && typeof optScanTitle !== 'string') {
        optScanTitle = 'title';
      }
      if (optScanAbstract && typeof optScanAbstract !== 'string') {
        optScanAbstract = 'abstract';
      }

      const [title, abstract] = scanTitleAndAbstract(
        root,
        !!optScanTitle && !frontmatter[optScanTitle],
        !!optScanAbstract && !frontmatter[optScanAbstract]
      );
      if (title && optScanTitle) {
        frontmatter[optScanTitle] = title;
      }
      if (abstract && optScanAbstract) {
        frontmatter[optScanAbstract] = abstract;
      }
    }

    const stop = join(file.cwd, 'src');
    const dir = file.dirname;

    if (dir && optFrontmatter) {
      if (typeof optFrontmatter !== 'string') {
        optFrontmatter = DEFAULT_FRONTMATTER;
      }
      const merged = await mergeFrontmatter(optFrontmatter, dir, stop);
      if (merged) {
        frontmatter = deepMerge(merged, frontmatter);
      }
    }

    file.data.astro.frontmatter = frontmatter;

    // TODO: Allow add-ons

    if (dir && optExportComponents) {
      if (typeof optExportComponents !== 'string') {
        optExportComponents = DEFAULT_EXPORT_COMPONENTS;
      }
      const files = await findUpAll(optExportComponents, dir, stop);
      if (files.length > 0) {
        exportComponents(root, files);
      }
    }

    if (dir && optAutoImports) {
      if (typeof optAutoImports !== 'string') {
        optAutoImports = DEFAULT_AUTO_IMPORTS;
      }
      const files = await findUpAll(optAutoImports, dir, stop);
      if (files.length > 0) {
        await autoImports(root, files);
      }
    }

    if (dir && optRelativeImages) {
      await relativeImages(root);
    }
  };
};

export default plugin;
