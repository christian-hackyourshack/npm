# remark-normalize-paths

Remark plugin to normalize relative paths in markdown, by resolving them to the current markdown file's directory.

## Content

- [Content](#content)
- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
  - [Options](#options)
    - [`rebase?: string`](#rebase-string)
    - [`checkExistence?: boolean`](#checkexistence-boolean)
    - [`include?: string[]`](#include-string)
    - [`exclude?: string[]`](#exclude-string)

## What is this?

This package is a [`remark`](https://github.com/remarkjs/remark/blob/main/doc/plugins.md) plugin.

## When should I use this?

If you want to resolve paths relative to the current file.

All `url` parameters of all nodes are resolved, as well as all string-valued attributes of MDX flow elements and directives, that look like a relative path, i.e. that start with `./` or `../`.

You can further specifiy, whether you want to normalize a path only, if the normalized target exists, see [Options](#options) for details.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with `npm`:

```sh
npm install remark-normalize-paths
```

## Use

```ts
import remarkDirective from 'remark-directive';
import remarkMdx from 'remark-mdx';
import remarkNormalizePaths from 'remark-normalize-paths';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

const processor = unified()
  .use(remarkParse)
  .use(remarkDirective)
  .use(remarkNormalizePaths, { exclude: ["link", "<CustomComponent>"] });
```

This markdown in the file `/workspace/content/index.md`:

```md
![](./picture.jpg)

[Read more](./all/index.html)

<img src="../other-picture.png" />

::Quote[MDX is great]{author="Me" avatar="./me.jpg" .xxl}

<CustomComponent ref="./input.txt" />
```

would yield the following paths:

- `./picture.jpg` -> `/workspace/content/picture.jpg`
- `./all/index.html` -> `./all/index.html`, because links are excluded in the extensions configuration
- `../other-picture.png` -> `/workspace/other-picture.png`
- `./me.jpg` -> `/workspace/content/me.jpg`


### Options

#### `rebase?: string`

Path to use as new base path and make all resulting paths relative to this path.

Default is `undefined`, i.e. resulting paths will be absolute.

#### `checkExistence?: boolean`

Normalize path only, if normalized path exists, leave untouched otherwise.

Default is `true`.

#### `include?: string[]`

List of MDX element types or JSX tags (if put in angle brackets, e.g. `<img>`)to include during path normalization (only the named types will be included).

Default is `undefined`, i.e. all MDX element types will be included.

#### `exclude?: string[]`

List of MDX element types or JSX tags (if put in angle brackets, e.g. `<img>`) to exclude during path normalization. E.g. `['link', '<a>']` to exclude markdown links and JSX anchor tags.

Default is `undefined`, i.e. no MDX element types will be excluded.
