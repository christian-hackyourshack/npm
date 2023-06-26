# remark-mdx-mappings

Remark plugin to add mappings of markdown nodes to MDX components (Astro style, i.e. with `export const components = { ... }`).

## Content

- [Content](#content)
- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
  - [Options](#options)
    - [`file?: string`](#file-string)

## What is this?

This package is a [`remark`](https://github.com/remarkjs/remark/blob/main/doc/plugins.md) plugin that helps with MDX files.

## When should I use this?

If you want define a mapping from markdown nodes to MDX components to be used to render the respective elements.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with `npm`:

```sh
npm install remark-mdx-mappings
```

## Use

```ts
import remarkMdx from 'remark-mdx';
import remarkMdxMappings from 'remark-mdx-mappings';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

const processor = unified() //
  .use(remarkParse)
  .use(remarkMdx)
  .use(remarkMdxMappings);
```

This markdown:

```md
# Title

This image was taken from [Unsplash](https://unsplash.com/):

![A cat](./foo.jpg)
```

with this `_components.ts` file:

```ts
import { Link } from '@components/Link';
import { Image } from '@components/Image';

export const components = {
  img: Image,
  link: Link,
};
```

would use the `Image` and `Link` components from the `_components.ts` file to render images and links respectively.

### Options

#### `file?: string`

Name of the file to lookup component mappings.
