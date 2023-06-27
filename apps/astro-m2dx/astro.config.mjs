import { defineConfig } from 'astro/config';

import image from '@astrojs/image';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import remarkClassDirective from 'remark-class-directive';
import remarkDirective from 'remark-directive';
import remarkEnhanceFrontmatter from 'remark-enhance-frontmatter';
import remarkMdxImports from 'remark-mdx-imports';
import remarkMdxIncludes from 'remark-mdx-includes';
import remarkMdxMappings from 'remark-mdx-mappings';
import remarkNormalizePaths from 'remark-normalize-paths';
import remarkSectionizeHeadings from 'remark-sectionize-headings';
import remarkUnwrapImages from 'remark-unwrap-images';

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

/** @type {import('@astrojs/image').IntegrationOptions} */
const imageOptions = {
  serviceEntryPoint: '@astrojs/image/sharp',
};

/** @type {import('@astrojs/mdx').MdxOptions} */
const mdxOptions = {
  remarkPlugins: [
    [remarkEnhanceFrontmatter, frontmatterOptions],
    [remarkSectionizeHeadings, sectionizeOptions],
    remarkUnwrapImages,
    remarkDirective,
    remarkClassDirective,
    remarkMdxIncludes,
    remarkNormalizePaths,
    remarkMdxImports,
    remarkMdxMappings,
  ],
};

// https://astro.build/config
export default defineConfig({
  integrations: [image(imageOptions), mdx(mdxOptions), tailwind()],
});
