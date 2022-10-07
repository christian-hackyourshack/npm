import type { Root } from 'mdast';
import { join } from 'path';
import type { Plugin } from 'unified';
import { autoImports } from './autoImports';
import { componentDirectives } from './componentDirectives/componentDirectives';
import { exportComponents } from './exportComponents/exportComponents';
import { includeDirective } from './includeDirective/includeDirective';
import { mergeFrontmatter } from './mergeFrontmatter';
import { parseFrontmatter } from './parseFrontmatter';
import { relativeImages } from './relativeImages/relativeImages';
import { scanTitleAndAbstract } from './scanTitleAndAbstract';
import { styleDirectives } from './styleDirectives/styleDirectives';
import type { VFile } from './types/VFile';
import { deepMerge } from './utils/deepMerge';
import { findUpAll } from './utils/fs';

const DEFAULT_AUTO_IMPORTS_NAME = '_autoimports.ts';
const DEFAULT_COMPONENT_DIRECTIVES_NAME = '_directives.ts';
const DEFAULT_EXPORT_COMPONENTS_NAME = '_components.ts';
const DEFAULT_FRONTMATTER_NAME = '_frontmatter.yaml';
const DEFAULT_INCLUDE_DIRECTIVE_NAME = 'include';
const DEFAULT_MDAST_NAME = 'mdast';
const DEFAULT_RAW_MDX_NAME = 'rawmdx';
const DEFAULT_SCAN_ABSTRACT_NAME = 'abstract';
const DEFAULT_SCAN_TITLE_NAME = 'title';

/**
 * Transformer interface that must be implemented by addons.
 *
 * @param root root of the MDX AST
 * @param file VFile including frontmatter at `data.astro.frontmatter`
 */
export type AddOn = (root: Root, file: VFile) => Promise<void | Root>;

/**
 * Options for plugin astro-m2dx, for details see
 * https://astro-m2dx.netlify.app/options
 */
export type Options = Partial<{
  /**
   * Apply any custom transformations to the MDAST.
   *
   * - default: none
   * - Set of transformer functions that are executed after all internal
   *   astro-m2dx transformations.
   */
  addOns: AddOn[];

  /**
   * Add imports for known JSX components in MDX files automatically.
   *
   * - default: `false`, no components are imported automatically
   * - `true`, to enable automatic imports from files with name
   *   `_autoimports.ts`
   * - `<name>`, to find automatic imports in files named `<name>`
   *
   * These files should be simple JavaScript/ESM files (i.e. ES >=6).
   */
  autoImports: boolean | string;

  /**
   * Fail if unresolved components cannot be resolved by autoImports.
   *
   * - default: `false`
   * - `true` to throw an error on unresolved components
   */
  autoImportsFailUnresolved: boolean;

  /**
   * Map generic markdown directives to JSX components.
   *
   * - default: `false`, no directives are mapped to components
   * - `true`, to enable mapping directives to components according to files
   *   with name `_directives.ts`
   * - `<name>`, to find directive mappings in files named `<name>`
   *
   * These files should be simple JavaScript/ESM files (i.e. ES >=6).
   */
  componentDirectives: boolean | string;

  /**
   * Merge ESM component mapping-files into the exported `components` object
   * of MDX files.
   *
   * - default: `false`, no component mapping is merged
   * - `true`, to enable component mapping merging from files with name
   *   `_components.ts`
   * - `<name>`, to find component mapping-files with `<name>`
   */
  exportComponents: boolean | string;

  /**
   * Merge YAML frontmatter files into the frontmatter of MDX files.
   *
   * - default: `false`, no frontmatter is merged
   * - `true`, to enable frontmatter merging from files with name
   *   `_frontmatter.yaml`
   * - `<name>`, to find frontmatter in YAML files named `<name>`
   */
  frontmatter: boolean | string;

  /**
   * Include other MDX files in your MDX file with a
   * `::include[./partial.mdx]` directive
   *
   * - default: `false`
   * - `true`, to enable this directive with the name `::include`
   * - `<name>`, to enable the directive with name `::<name>[./ref.mdx]`
   */
  includeDirective: boolean | string;

  /**
   * Inject the MD AST into the frontmatter.
   *
   * > NOTE: The injected tree is not read by the HTML generation,
   *   so manipulation does not make sense.
   *
   * - default: `false`
   * - `true`, to have it injected into property `mdast`
   * - `<name>`, to have it injected as property `<name>`
   */
  mdast: boolean | string;

  /**
   * Inject the raw MDX into the frontmatter.
   *
   * - default: `false`
   * - `true`, to have it injected into property `rawmdx`
   * - `<name>`, to have it injected as property `<name>`
   */
  rawmdx: boolean | string;

  /**
   * Resolve relative image references in MDX files.
   *
   * - default: `false`
   * - `true`, to enable relative image resolution
   */
  relativeImages: boolean;

  /**
   * Scan the content for the abstract and inject it into the frontmatter.
   *
   * The abstract will be taken from the content between the title and the next
   * heading. BEWARE: The content is raw MDX!
   *
   * - default: `false`
   * - `true`, to have it injected into property `abstract`
   * - `<name>`, to have it injected as property `<name>`
   *
   * If the frontmatter already has a property with that name, it will **NOT** be overwritten.
   */
  scanAbstract: boolean | string;

  /**
   * Scan the content for the title and inject it into the frontmatter.
   *
   * The title will be taken from the first heading with depth=1,
   * i.e. the first line `# My Title`.
   *
   * - default: `false`
   * - `true`, to have it injected into property `title`
   * - `<name>`, to have it injected as property `<name>`
   *
   * If the frontmatter already has a property with that name, it will **NOT** be overwritten.
   */
  scanTitle: boolean | string;

  /**
   * Flag to allow style directives,...
   *
   * - default: `false`
   * - `true`, to enable generic directives
   */
  styleDirectives: boolean;
}>;

/**
 *  Astro M²DX Plugin
 *
 * @param options For configuration options, see https://astro-m2dx.netlify.app/options
 * @returns transformer function
 */
export const plugin: Plugin<[Options], unknown> = (options = {}) => {
  const {
    addOns = [],
    autoImportsFailUnresolved: optAutoImportsFailUnresolved = false,
    relativeImages: optRelativeImages = false,
    styleDirectives: optStyleDirectives = false,
  } = options;
  let {
    autoImports: optAutoImports = false,
    componentDirectives: optComponentDirectives = false,
    exportComponents: optExportComponents = false,
    frontmatter: optFrontmatter = false,
    includeDirective: optIncludeDirective = false,
    mdast: optMdast = false,
    rawmdx: optRawmdx = false,
    scanAbstract: optScanAbstract = false,
    scanTitle: optScanTitle = false,
  } = options;

  return async function transformer(root: Root, file: VFile) {
    let frontmatter = deepMerge(await parseFrontmatter(file.path), file.data.astro.frontmatter);

    if (optRawmdx) {
      if (typeof optRawmdx !== 'string') {
        optRawmdx = DEFAULT_RAW_MDX_NAME;
      }
      if (!frontmatter[optRawmdx]) {
        frontmatter[optRawmdx] = file.value;
      }
    }

    if (optMdast) {
      if (typeof optMdast !== 'string') {
        optMdast = DEFAULT_MDAST_NAME;
      }
      if (!frontmatter[optMdast]) {
        frontmatter[optMdast] = root;
      }
    }

    if (optScanTitle || optScanAbstract) {
      if (optScanTitle && typeof optScanTitle !== 'string') {
        optScanTitle = DEFAULT_SCAN_TITLE_NAME;
      }
      if (optScanAbstract && typeof optScanAbstract !== 'string') {
        optScanAbstract = DEFAULT_SCAN_ABSTRACT_NAME;
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
        optFrontmatter = DEFAULT_FRONTMATTER_NAME;
      }
      const merged = await mergeFrontmatter(optFrontmatter, dir, stop);
      if (merged) {
        frontmatter = deepMerge(merged, frontmatter);
      }
    }

    file.data.astro.frontmatter = frontmatter;

    if (dir && optExportComponents) {
      if (typeof optExportComponents !== 'string') {
        optExportComponents = DEFAULT_EXPORT_COMPONENTS_NAME;
      }
      const files = await findUpAll(optExportComponents, dir, stop);
      if (files.length > 0) {
        exportComponents(root, files);
      }
    }

    if (dir && optAutoImports) {
      if (typeof optAutoImports !== 'string') {
        optAutoImports = DEFAULT_AUTO_IMPORTS_NAME;
      }
      const files = await findUpAll(optAutoImports, dir, stop);
      if (files.length > 0) {
        await autoImports(root, files, optAutoImportsFailUnresolved);
      }
    }

    if (optStyleDirectives) {
      styleDirectives(root);
    }

    if (dir && optIncludeDirective) {
      if (typeof optIncludeDirective !== 'string') {
        optIncludeDirective = DEFAULT_INCLUDE_DIRECTIVE_NAME;
      }
      includeDirective(root, dir, optIncludeDirective);
    }

    if (dir && optComponentDirectives) {
      if (typeof optComponentDirectives !== 'string') {
        optComponentDirectives = DEFAULT_COMPONENT_DIRECTIVES_NAME;
      }
      const files = await findUpAll(optComponentDirectives, dir, stop);
      if (files.length > 0) {
        await componentDirectives(root, files);
      }
    }

    if (dir && optRelativeImages) {
      await relativeImages(root, dir);
    }

    for (const addOn of addOns) {
      root = (await addOn(root, file)) ?? root;
    }
  };
};

export default plugin;
