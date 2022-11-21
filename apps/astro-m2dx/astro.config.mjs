import { defineConfig } from 'astro/config';

import image from '@astrojs/image';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import m2dx from 'astro-m2dx';
import remarkDirective from 'remark-directive';
import sectionizeHeadings from 'remark-sectionize-headings';
import { noteDirective } from './addons/noteDirective.mjs';

/** @type {import('remark-sectionize-headings').Options} */
const sectionizeOptions = {
  addClass: 'section',
  levels: [2],
};

/** @type {import('astro-m2dx').Options} */
const m2dxOptions = {
  addOns: [noteDirective],
  autoImports: true,
  autoImportsFailUnresolved: true,
  componentDirectives: true,
  exportComponents: true,
  frontmatter: true,
  identifyImages: true,
  includeDirective: true,
  normalizePaths: true,
  rawmdx: true,
  // relativeImages: true,
  scanAbstract: true,
  scanTitle: true,
  styleDirectives: true,
  unwrapImages: true,
};

/** @type {import('@astrojs/image').IntegrationOptions} */
const imageOptions = {
  serviceEntryPoint: '@astrojs/image/sharp',
};

/** @type {import('@astrojs/mdx').MdxOptions} */
const mdxOptions = {
  remarkPlugins: [
    remarkDirective, // required for styleDirectives
    [sectionizeHeadings, sectionizeOptions],
    [m2dx, m2dxOptions],
  ],
  extendDefaultPlugins: true,
};

// https://astro.build/config
export default defineConfig({
  integrations: [image(imageOptions), mdx(mdxOptions), tailwind()],
});
