import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import m2dx from 'astro-m2dx';
import sectionizeHeadings from 'remark-sectionize-headings';

import { defineConfig } from 'astro/config';

/** @type {import('astro-m2dx').Options} */
const m2dxOptions = {
  rawmdx: true,
  scanTitle: true,
  scanAbstract: true,
  relativeImages: true,
  autoImportsFailUnresolved: true,
};

/** @type {import('remark-sectionize-headings').Options} */
const sectionizeOptions = {
  sectionize: {
    levels: [2],
  },
};

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), tailwind()],
  markdown: {
    remarkPlugins: [
      [m2dx, m2dxOptions],
      [sectionizeHeadings, sectionizeOptions],
    ],
    extendDefaultPlugins: true,
  },
  vite: {
    ssr: {
      external: ['svgo'],
    },
  },
});
