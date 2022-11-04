# remark-sectionize-headings

remark plugin to wrap markdown headings and the following paragraphs in HTML `section` elements.

An alternative could be [remark-sectionize](https://www.npmjs.com/package/remark-sectionize), but this plugin offers a few more options and adds a CSS class according to the heading level to the resulting section.

## Content

- [Content](#content)
- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
  - [Options](#options)
    - [`addClass?: boolean | string`](#addclass-boolean--string)
    - [`levels: number[]`](#levels-number)

## What is this?

This package is a [`remark`](https://github.com/remarkjs/remark/blob/main/doc/plugins.md) plugin.

## When should I use this?

If you want to style sections of your document according to heading levels and need to wrap markdown headings and the following paragraphs in HTML `section` elements.

This is a pure remark plugin and can be used outside of an Astro context.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with `npm`:

```sh
npm install remark-sectionize-headings
```

## Use

In your `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sectionizeHeadings from 'remark-sectionize-headings';
//                              ^^^

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [sectionizeHeadings],
    //              ^^^
    extendDefaultPlugins: true,
  },
});
```

This uses the default options, where all headings are wrapped according to their level.

This markdown:

```md
## Deprecated

- **remark-astro-auto-layout** - despite being the most successful plugin thus far, you should use the `remark-astro-frontmatter` plugin instead to define your common layout.
```

would yield this HTML:

```html
<section class="h2">
  <h2 id="deprecated">Deprecated</h2>
  <ul>
    <li>
      <strong>remark-astro-auto-layout</strong> - despite being the most successful plugin thus far,
      you should use the <code>astro-m2dx</code> plugin instead to define your common layout.
    </li>
  </ul>
</section>
```

### Options

#### `addClass?: boolean | string`

This option adds a class corresponding to the heading to the injected
section.

- string `<name>`, e.g. `section` to add classes `section section--h1`, ...
- false to disable class addition completely
- default: true, adds classes `h1`, `h2`, ...

#### `levels: number[]`

Heading levels to wrap into sections

- e.g. `[ 2, 3 ]` for only levels 2 & 3
- default: all
