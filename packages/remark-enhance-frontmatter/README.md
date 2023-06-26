# remark-enhance-frontmatter

Remark plugin to enhance frontmatter in markdown files with common frontmatter files per directory and a few other derived attributes.

## Content

- [Content](#content)
- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
  - [Options](#options)
    - [`file?: string`](#file-string)
    - [`resolvePaths?: boolean`](#resolvepaths-boolean)
    - [`title?: boolean`](#title-boolean)
    - [`transform?: Transform[]`](#transform-transform)

## What is this?

This package is a [`remark`](https://github.com/remarkjs/remark/blob/main/doc/plugins.md) plugin.

## When should I use this?

If you want to add some coomon frontmatter to all markdown files in a directory.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with `npm`:

```sh
npm install remark-enhance-frontmatter
```

## Use

```ts
import remarkEnhanceFrontmatter from 'remark-enhance-frontmatter';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

const processor = unified()
  .use(remarkParse)
  .use(remarkDirective)
  .use(remarkEnhanceFrontmatter, { title: true });
```

### Options

#### `file?: string`

Name of the file that defines the pre-defined exports, default: `_components.ts`

#### `resolvePaths?: boolean`

Resolve relative paths from the merged frontmatter file with respect to that file.

#### `title?: boolean`

Add a `title` field to the frontmatter. The title is the first top-level heading in the markdown file `# Title`.

#### `transform?: Transform[]`

List of functions to transform the frontmatter.
