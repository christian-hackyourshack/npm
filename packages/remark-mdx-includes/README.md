# remark-mdx-includes

Remark plugin to include other MDX files by `::include` directive.

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

If you want to include other MDX files in the current file, e.g. to create partials like a footer.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with `npm`:

```sh
npm install remark-mdx-includes
```

## Use

```ts
import remarkDirective from 'remark-directive';
import remarkMdx from 'remark-mdx';
import remarkMdxIncludes from 'remark-mdx-includes';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

const processor = unified() //
  .use(remarkParse)
  .use(remarkDirective)
  .use(remarkMdx)
  .use(remarkMdxIncludes);
```

This markdown:

```md
<Title text="Hello, world!" />

<Hero>
  I **am** a hero!
</Hero>
```

with this `_components.ts` file:

```ts
export { Hero } from './Hero';
export { Title } from './Title';
```

would compile without issues, using the exported components from `_components.ts` automatically.

### Options

#### `file?: string`

Name of the file to lookup pre-defined component exports.
