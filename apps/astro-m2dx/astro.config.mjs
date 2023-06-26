import { defineConfig } from 'astro/config';

import image from '@astrojs/image';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import m2dx from 'astro-m2dx';
import remarkClassDirective from 'remark-class-directive';
import remarkDirective from 'remark-directive';
import remarkEnhanceFrontmatter from 'remark-enhance-frontmatter';
import remarkMdxImports from 'remark-mdx-imports';
import remarkMdxMappings from 'remark-mdx-mappings';
import remarkNormalizePaths from 'remark-normalize-paths';
import remarkSectionizeHeadings from 'remark-sectionize-headings';
import remarkUnwrapImages from 'remark-unwrap-images';
import { noteDirective } from './addons/noteDirective.mjs';

/** @type {import('remark-enhance-frontmatter').Options} */
const frontmatterOptions = {
  resolvePaths: true,
  title: true,
  transform: [
    (frontmatter, vfile) => {
      frontmatter.rawmdx = vfile.value;
    },
  ],
};

/** @type {import('remark-sectionize-headings').Options} */
const sectionizeOptions = {
  addClass: 'section',
  levels: [2],
};

/** @type {import('astro-m2dx').Options} */
const m2dxOptions = {
  addOns: [noteDirective],
  // autoImports: true,
  // autoImportsFailUnresolved: true,
  componentDirectives: true,
  // exportComponents: true,
  // frontmatter: true,
  // identifyImages: true,
  includeDirective: true,
  // normalizePaths: true,
  // rawmdx: true,
  // scanTitle: true,
  // styleDirectives: true,
  // unwrapImages: true,
};

/** @type {import('@astrojs/image').IntegrationOptions} */
const imageOptions = {
  serviceEntryPoint: '@astrojs/image/sharp',
};

/** @type {import('@astrojs/mdx').MdxOptions} */
const mdxOptions = {
  remarkPlugins: [
    [remarkEnhanceFrontmatter, frontmatterOptions],
    remarkDirective,
    remarkUnwrapImages,
    remarkClassDirective,
    [remarkSectionizeHeadings, sectionizeOptions],
    remarkNormalizePaths,
    remarkMdxImports,
    remarkMdxMappings,
    [m2dx, m2dxOptions],
  ],
};

// https://astro.build/config
export default defineConfig({
  integrations: [image(imageOptions), mdx(mdxOptions), tailwind()],
});
