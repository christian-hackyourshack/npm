# remark-importless-jsx

Remark plugin to automatically import defined JSX components.

## Content

- [Content](#content)
- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
  - [Options](#options)
    - [`file?: string`](#file-string)

## What is this?

This package is a [`remark`](https://github.com/remarkjs/remark/blob/main/doc/plugins.md) plugin.

## When should I use this?

If you want remove technical clutter from your MDX files by pre-defining a set of known JSX components for your MDX files, that you can use without importing them.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with `npm`:

```sh
npm install remark-importless-jsx
```

## Use

```ts
import rehypeStringify from 'rehype-stringify';
import remarkImportlessJsx from 'remark-importless-jsx';
import remarkDirective from 'remark-directive';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

const processor = unified()
  .use(remarkParse)
  .use(remarkMdx)
  .use(remarkImportlessJsx)
  .use(remarkRehype)
  .use(rehypeStringify);
```

This markdown:

```mdx
```

with this `_components.ts` file:

```ts
import { Hero } from '../components/Hero';
```

would yield this HTML:

```html
<h1>Astro Docs</h1>
<div></div>
<p>Paragraph 1 with <strong class="text-red">strong emphasis</strong>.</p>
<div class="bg-accent decent">
  <h2>Chapter 1</h2>
  <p>A lot of text here.</p>
</div>
<ul class="nav">
  <li>Home</li>
  <li>Blog</li>
  <li>Docs</li>
</ul>
```

### Options

#### `file?: string`

Name of the file to lookup for pre-defined component exports.
