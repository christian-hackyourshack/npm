# astro-m2dx

Remark plugin allowing you to write **clean** markdown, while still using all the great features of [MDX](https://mdxjs.com).

Use [Astro](https://astro.build) 🚀 and this plugin to build your publishing pipeline for feature-rich **and** clean Markdown/MDX.

Have a look at the [full documentation](https://astro-m2dx.netlify.app).

> **Astronaut, dust off your MDX!**

## Content

- [Content](#content)
- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
  - [Options](#options)
    - [Default Frontmatter](#default-frontmatter)
    - [Export Components](#export-components)
    - [Auto-imports](#auto-imports)
    - [Relative Images](#relative-images)
    - [Inject Raw MDX](#inject-raw-mdx)
    - [Inject MDAST](#inject-mdast)
    - [Scan Title](#scan-title)
    - [Scan Abstract](#scan-abstract)

## What is this?

This package is a [`remark`](https://github.com/remarkjs/remark/blob/main/doc/plugins.md) plugin for markdown files in the context of [Astro](https://docs.astro.build/en/guides/integrations-guide/mdx) site generation.

## When should I use this?

If you use Astro to generate a site from Markdown files and you want to [dust off your MDX](https://astro-m2dx.netlify.app/blog/dust-off-your-mdx).

The different features of this plugin will help you keep your Markdown clean:

- [Define default frontmatter](#default-frontmatter) properties for all files in a directory, e.g. the `layout`
- [Map HTML elements to JSX components](#export-components) on a per-directory basis
- [Auto-import known JSX components](#auto-imports) on a per-directory basis
- Scan the document for [Title](#scan-title) or [Abstract](#scan-abstract) to use your content to define the title and abstract for your document and omit ugliness like `# {frontmatter.title}`
- [Inject raw MDX](#inject-raw-mdx) and get (read-only) access to the (really) raw MDX content of your file.
- [Inject the MDAST](#inject-mdast) and get (read-only) access to the **M**ark**D**own **A**bstract **S**yntax **T**ree, e.g. to transform to text or analyze for added meta-info in your layout.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with `npm`:

```sh
npm install -D astro-m2dx
```

## Use

In your `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import m2dx from 'astro-m2dx';
//                ^^^^^^^^^^

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [m2dx],
    //              ^^^^
    extendDefaultPlugins: true,
  },
});
```

This uses the default options, where most of the configuration is done through files in your content directory. In general, these files are evaluated up the directory tree, i.e. files closer to the MDX file take precedence over files further up the tree.

### Options

You can specify options for the plugin in `astro.config.mjs` like so:

```js
remarkPlugins: [[m2dx, {...your_options}]],
```

The following options are available to toggle features or configure their basic behavior:

#### Default Frontmatter

`frontmatter: boolean | string`

Merge YAML frontmatter files into the frontmatter.

- false, to disable frontmatter merging
- name, to find frontmatter in YAML files with `name` up the directory tree
- default: `_frontmatter.yaml`

Create frontmatter YAML files with the defined name in your `src` directory to define common properties.

```yaml
layout: @layouts/BlogLayout.astro
```

> ⚠️ Beware of relative references inside these files: The values are merged as-is and hence will be relative to the receiving MDX file and not the default frontmatter-file. It is safer to define `paths` in your tsconfig.json.

The properties will be deeply merged, where user properties from the markdown file's frontmatter will have highest priority, and properties from frontmatter files closer to the markdown file will take precedence over properties from files higher up the tree. Array, Date and Regex will not be merged.

#### Export Components

`exportComponents: boolean | string`

In Astro you can define a mapping from HTML elements to JSX components by exporting `const components = { ... }` in any MDX file. With this plugin you can define this export per directory, by creating a mapping-file exporting a `components` constant object expression, that maps HTML tags to JSX components:

```js
import { Title } from '@components/Title';

export const components = {
  h1: Title,
};
```

The option allows you to toggle the feature and define the name of your central mapping-files.

- name, to find mapping-files with `name` (searches up the directory tree, starting at the MDX file)
- false, to disable automatic component mapping
- default: `_components.ts`

You can use it like so:

```js
remarkPlugins: [[m2dx, {exportComponents: "_components.js"}]],
```

#### Auto-imports

`autoImports: boolean | string`

Name for auto-import files.

- name, to find files with `name` up the directory tree
- false, to disable automatic component mapping
- default: `_autoimports.ts`

Despite the suffix of the default value, these files should be simple JavaScript/ESM files (i.e. ES >=6) and not use any none-ES TypeScript features.

Now create an auto-import file exporting known components:

```js
import { Code } from 'astro/components';

export const autoimports = {
  Code,
};
```

In your MDX file you can now use `<Code ... />` without importing it:

```md
# My Title

Here I am embedding some fancy code from the frontmatter:

<Code code={frontmatter.rawmdx} />
```

> You can structure your export pretty much as you like, as long as the variable initialization is an object expression without spread operator.

Files are evaluated up the directory tree, i.e. files closer to the MDX file take precedence over files further up the tree.

The variables inside a file are evaluated in order of appearance, i.e. the following export would yield the component FuzzyBear over FozzieBear for the use in `<Bear />`, although `b` is the default export:

```js
import { FuzzyBear } from '@components/FuzzyBear';
import { FozzieBear } from '@components/FozzieBear';

export const a = {
  Bear: FuzzyBear,
};

const b = {
  Bear: FozzieBear,
};

export default b;
```

#### Relative Images

Option `relativeImages: boolean`

Flag to allow relative image references.

All relative image references `![My alt text] (my-image.png "Fancy Title")` with a resolvable reference are replaced with an HTML `<img />` tag with the appropriate attributes, that uses an imported image reference as `src` attribute.

- true, to enable relative image resolution
- default: false

#### Inject Raw MDX

`rawmdx: boolean | string`

Inject the raw MDX into the frontmatter.

- true, to have it injected into property `rawmdx`
- name, to have it injected as property `<name>`
- default: `false`

#### Inject MDAST

`mdast: boolean | string`

Inject the MD AST into the frontmatter.

> NOTE: The injected tree is not read by the HTML generation,
> so manipulation does not make sense.

- true, to have it injected into property `mdast`
- name, to have it injected as property `<name>`
- default: `false`

#### Scan Title

`scanTitle: boolean | string`

Scan the content for the title and inject it into the frontmatter.

The title will be taken from the first heading with depth=1,
i.e. the first line `# My Title`.

- true, to have it injected into property `title`
- name, to have it injected as property `<name>`
- default: `false`

If the frontmatter already has a property with that name, it will **NOT** be overwritten.

#### Scan Abstract

`scanAbstract: boolean | string`

Scan the content for the abstract and inject it into the frontmatter.

The abstract will be taken from the content between the title and the next
heading. It will only be textual content.

- true, to have it injected into property `abstract`
- name, to have it injected as property `<name>`
- default: `false`

If the frontmatter already has a property with that name, it will **NOT** be overwritten.
