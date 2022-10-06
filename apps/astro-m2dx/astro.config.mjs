import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import m2dx from 'astro-m2dx';
import remarkDirective from 'remark-directive';
import sectionizeHeadings from 'remark-sectionize-headings';
import { noteDirective } from './addons/noteDirective.mjs';

/** @type {import('remark-sectionize-headings').Options} */
const sectionizeOptions = {
  sectionize: {
    levels: [2],
  },
};

/** @type {import('astro-m2dx').Options} */
const m2dxOptions = {
  addOns: [noteDirective],
  autoImports: true,
  autoImportsFailUnresolved: true,
  exportComponents: true,
  frontmatter: true,
  includeDirective: true,
  rawmdx: true,
  relativeImages: true,
  scanAbstract: true,
  scanTitle: true,
  styleDirectives: true,
};

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), tailwind()],
  markdown: {
    remarkPlugins: [
      remarkDirective, // required for styleDirectives
      [sectionizeHeadings, sectionizeOptions],
      [m2dx, m2dxOptions],
    ],
    extendDefaultPlugins: true,
  },
  vite: {
    ssr: {
      external: ['svgo'],
    },
  },
});
