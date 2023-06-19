# remark-class-directive

Remark plugin to add html class attributes to nodes generated from markdown by adding `:class` directives.

## Content

- [Content](#content)
- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
  - [Options](#options)
    - [`name?: string`](#name-string)

## What is this?

This package is a [`remark`](https://github.com/remarkjs/remark/blob/main/doc/plugins.md) plugin.

## When should I use this?

If you want to style HTML elements generated from your document individually.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with `npm`:

```sh
npm install remark-class-directive
```

## Use

```ts
import rehypeStringify from 'rehype-stringify';
import remarkClassDirective from 'remark-class-directive';
import remarkDirective from 'remark-directive';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

const processor = unified()
  .use(remarkParse)
  .use(remarkDirective)
  .use(remarkClassDirective)
  .use(remarkRehype)
  .use(rehypeStringify);
```

This markdown:

```md
# Astro Docs

::other-directive

Paragraph 1 with **:class{.text-red}strong emphasis**.

:::class{.bg-accent}

## Chapter 1

::class{.decent}

A lot of text here.

:::

::list-class{.nav}

- Home
- Blog
- Docs
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

As you can see, the `:class` directive is applied to the nearest containing node, i.e. a text-directive (single colon `:class`) is applied to the nearest `span` or `paragraph`, a leaf-directive (double colon `::class`) is applied to the nearest block element (usually a `div` or `section`), a block-directive (triple colon `:::class`) creates it's own `div` element.

### Options

#### `name?: string`

Name of the directive to use, default is `class`, i.e. you can use `::class{.red}` in your markdown.
