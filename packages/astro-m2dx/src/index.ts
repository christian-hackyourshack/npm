import { deepMerge, findUpAll, normalizeAll } from '@internal/utils';
import { readFile } from 'fs/promises';
import grayMatter from 'gray-matter';
import type { Root } from 'mdast';
import { join } from 'path';
import type { Plugin } from 'unified';
import { autoImports } from './autoImports';
import { componentDirectives } from './componentDirectives';
import { exportComponents } from './exportComponents';
import { identifyImages } from './identifyImages';
import { includeDirective } from './includeDirective';
import { mergeFrontmatter } from './mergeFrontmatter';
import { normalizePaths } from './normalizePaths';
import { relativeImages } from './relativeImages';
import { scanTitleAndAbstract } from './scanTitleAndAbstract';
import { styleDirectives } from './styleDirectives';
import type { VFile } from './types/VFile';
import { unwrapImages } from './unwrapImages';

const DEFAULT_AUTO_IMPORTS_NAME = '_autoimports.ts';
const DEFAULT_COMPONENT_DIRECTIVES_NAME = '_directives.ts';
const DEFAULT_EXPORT_COMPONENTS_NAME = '_components.ts';
const DEFAULT_FRONTMATTER_NAME = '_frontmatter.yaml';
const DEFAULT_IMAGE_ID_PREFIX = 'img_';
const DEFAULT_IMAGE_ID_DIGITS = 3;
const DEFAULT_INCLUDE_DIRECTIVE_NAME = 'include';
const DEFAULT_MDAST_NAME = 'mdast';
const DEFAULT_NORMALIZE_PATHS = {
  withFrontmatter: true,
  rebase: undefined,
  checkExistence: true,
  includeOnly: undefined,
  exclude: undefined,
};
const DEFAULT_RAW_MDX_NAME = 'rawmdx';
const DEFAULT_SCAN_ABSTRACT_NAME = 'abstract';
const DEFAULT_SCAN_TITLE_NAME = 'title';
const DEFAULT_STYLE_DIRECTIVES_NAME = 'style';

export * from './types/VFile';

/**
 * Transformer interface that must be implemented by addons.
 *
 * @param root root of the MDX AST
 * @param file VFile including frontmatter at `data.astro.frontmatter`
 */
export type AddOn = (root: Root, file: VFile) => void | Root | Promise<void | Root>;

/**
 * Options for plugin astro-m2dx, for details see
 * https://astro-m2dx.netlify.app/options
 */
export type Options = Partial<{
  /**
   * Apply any custom transformations to the MDAST.
   *
   * All transformations are executed after all internal astro-m2dx
   * transformations.
   *
   * - default: none
   * - Set of transformer functions
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
   * The merge is only applied after all file-specific frontmatter items have
   * been added. These will not be overwritten.
   *
   * - default: `false`, no frontmatter is merged
   * - `true`, to enable frontmatter merging from files with name
   *   `_frontmatter.yaml` and without resolving relative paths
   * - `<name>`, to find frontmatter in YAML files named `<name>`
   * - { name?: string, resolvePaths: true }, to resolve relative paths from
   *   the merged frontmatter file with respect to that file
   */
  frontmatter: boolean | string | { name?: string; resolvePaths?: boolean };

  /**
   * Assign identifiers to all images in the document
   *
   * - default: `false`, no identifiers are assigned
   * - `true`, identifiers are assigned with the default prefix `img_` and
   *   default number of digits `3`, the resulting ids look like `img_007`
   * - `<prefix>: string`, identifiers use the prefix `<prefix>` and default
   *   number of digits `3`
   * - `<digits>: number`, identifiers use the default prefix `img_` and the
   *   number of digits is `<digits>`
   * - { prefix: <prefix>, digits: <digits> }, identifiers use the given values
   *   for prefix and digits, e.g. `{ prefix: 'photo', digits: 5 }` would
   *   result in identifiers like `photo12345`
   */
  identifyImages: boolean | string | number | { prefix?: string; digits?: number };

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
   * Normalize relative paths in MDX file.
   *
   * - default: `false`
   * - `true`, to have relative paths normalized with default settings
   *   (see below)
   * - `{...}`, use the options object to configure individual settings
   *   - withFrontmatter: boolean, default = true, whether to normalize paths
   *     in frontmatter
   *   - rebase: string, default = `undefined` (i.e. resulting paths will be
   *     absolute), path to use as new base and make all resulting paths
   *     relative
   *   - checkExistence: boolean, default = true, normalize path only, if
   *     normalized path exists, leave untouched otherwise
   *   - includeOnly: list of MDX element types or JSX tags (if put in angle
   *     brackets, e.g. `<img>`) to include during path normalization
   *     (only the named types will be included)
   *   - exclude: list of MDX element types or JSX tags (if put in angle
   *     brackets, e.g. `<img>`) to include during path normalization
   *   - exclude: list of MDX element types to exclude during path
   *     (e.g. `['link', '<a>']` to exclude markdown links and JSX anchor tags)
   *
   * > NOTE: If you want to use this feature together with relativeImages, you
   *         must exclude the node type `image`.
   */
  normalizePaths:
    | boolean
    | string
    | {
        withFrontmatter?: boolean;
        rebase?: string;
        checkExistence?: boolean;
        includeOnly?: string[];
        exclude?: string[];
      };

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
   * heading. The content is converted to text.
   *
   * - default: `false`
   * - `true`, to have it injected into property `abstract`
   * - `<name>`, to have it injected as property `<name>`
   *
   * If the file's frontmatter already has a property with that name, it will
   * **NOT** be overwritten. However, the scanned abstract has precedence over
   * a property from merged frontmatter.
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
   * If the file's frontmatter already has a property with that name, it will
   * **NOT** be overwritten. However, the scanned title has precedence over
   * a property from merged frontmatter.
   */
  scanTitle: boolean | string;

  /**
   * Allow style directives in markdown.
   *
   * Style directives allow you to mix some style hints into your markdown, by
   * applying CSS classes to elements. Style directives come in all three
   * directive forms: block, leaf and text.
   *
   * - The block form creates a containg div, carrying the declared CSS classes
   * - The leaf form applies the class to either it's content (given in
   *   [square braces], which will be wrapped in a `<div>`) or it's containing
   *   parent element
   * - The text form works the same as the leaf form, except that is used
   *   inside paragraphs and it's content is wrapped in a `<span>`
   *
   * - default: `false`
   * - `true`, to enable default style directives `::style` and `::list-style`
   * - `<name>`, to enable style directives with custom name `::<name>` and
   *   `::list-<name>`
   */
  styleDirectives: boolean | string;

  /**
   * Unwrap stand-alone images from paragraph
   *
   * - default: `false`
   * - `true`, remove wrapping paragraph element around stand-alone images.
   */
  unwrapImages: boolean;
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
    frontmatter: optFrontmatter = false,
    identifyImages: optIdentifyImages = false,
    relativeImages: optRelativeImages = false,
    unwrapImages: optUnwrapImages = false,
  } = options;
  let {
    autoImports: optAutoImports = false,
    componentDirectives: optComponentDirectives = false,
    exportComponents: optExportComponents = false,
    includeDirective: optIncludeDirective = false,
    mdast: optMdast = false,
    normalizePaths: optNormalizePaths = false,
    rawmdx: optRawmdx = false,
    scanAbstract: optScanAbstract = false,
    scanTitle: optScanTitle = false,
    styleDirectives: optStyleDirectives = false,
  } = options;

  return async function transformer(root: Root, file: VFile) {
    // ATTENTION: Because multiple features could rely on the same original input or on
    // transformed input or provide the same values, order (sadly) matters a
    // lot for the transformations...

    // read the original frontmatter from the file
    const originalSource = await readFile(file.path, 'utf8');
    let { data: frontmatter } = grayMatter(originalSource);
    // just in case Astro starts to insert any extra frontmatter at some point
    // (at the moment the received astro.frontmatter is always an empty object)
    frontmatter = deepMerge(frontmatter, file.data.astro.frontmatter);

    // rawmdx is order-independent
    if (optRawmdx) {
      if (typeof optRawmdx !== 'string') {
        optRawmdx = DEFAULT_RAW_MDX_NAME;
      }
      frontmatter[optRawmdx] ??= file.value;
    }

    // mdast is order-independent
    if (optMdast) {
      if (typeof optMdast !== 'string') {
        optMdast = DEFAULT_MDAST_NAME;
      }
      frontmatter[optMdast] ??= root;
    }

    // scanning for title and abstract should happen before merging more
    // general frontmatter from downstream frontmatter.yaml files, because the
    // parsed content is specific to the file
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
      let optFrontmatterName = DEFAULT_FRONTMATTER_NAME;
      let optFrontmatterResolve = false;
      if (typeof optFrontmatter === 'string') {
        optFrontmatterName = optFrontmatter;
      } else if (typeof optFrontmatter === 'object') {
        optFrontmatterName = optFrontmatter.name ?? DEFAULT_FRONTMATTER_NAME;
        optFrontmatterResolve = optFrontmatter.resolvePaths ?? false;
      }
      const merged = await mergeFrontmatter(optFrontmatterName, dir, stop, optFrontmatterResolve);
      if (merged) {
        // This makes sure, no original frontmatter is overwritten
        frontmatter = deepMerge(merged, frontmatter);
      }
    }

    if (dir && optNormalizePaths) {
      if (typeof optNormalizePaths === 'string') {
        optNormalizePaths = { ...DEFAULT_NORMALIZE_PATHS, rebase: optNormalizePaths };
      } else if (typeof optNormalizePaths !== 'object') {
        optNormalizePaths = DEFAULT_NORMALIZE_PATHS;
      } else {
        optNormalizePaths = { ...DEFAULT_NORMALIZE_PATHS, ...optNormalizePaths };
      }
      if (optNormalizePaths.withFrontmatter) {
        const { rebase, checkExistence } = optNormalizePaths;
        frontmatter = normalizeAll(frontmatter, dir, rebase, checkExistence);
      }
      normalizePaths(root, dir, optNormalizePaths);
    }

    file.data.astro.frontmatter = frontmatter;

    let exportComponentFiles: string[] | undefined;
    if (dir && optExportComponents) {
      if (typeof optExportComponents !== 'string') {
        optExportComponents = DEFAULT_EXPORT_COMPONENTS_NAME;
      }
      exportComponentFiles = await findUpAll(optExportComponents, dir, stop);
      if (exportComponentFiles.length > 0) {
        exportComponents(root, exportComponentFiles);
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
      if (typeof optStyleDirectives !== 'string') {
        optStyleDirectives = DEFAULT_STYLE_DIRECTIVES_NAME;
      }
      styleDirectives(root, optStyleDirectives);
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

    if (optUnwrapImages) {
      unwrapImages(root);
    }

    if (optIdentifyImages) {
      let prefix: string | undefined;
      let digits: number | undefined;
      if (typeof optIdentifyImages === 'string') {
        prefix = optIdentifyImages;
      } else if (typeof optIdentifyImages === 'number') {
        digits = optIdentifyImages;
      } else if (typeof optIdentifyImages === 'object') {
        ({ prefix, digits } = optIdentifyImages);
      }
      identifyImages(root, prefix ?? DEFAULT_IMAGE_ID_PREFIX, digits ?? DEFAULT_IMAGE_ID_DIGITS);
    }

    if (dir && optRelativeImages) {
      await relativeImages(root, dir, exportComponentFiles);
    }

    for (const addOn of addOns) {
      root = (await addOn(root, file)) ?? root;
    }
  };
};

export default plugin;
