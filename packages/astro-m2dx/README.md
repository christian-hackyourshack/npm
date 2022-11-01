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
  - [Default Frontmatter](#default-frontmatter)
  - [Export Components](#export-components)
  - [Auto-imports](#auto-imports)
  - [Relative Images](#relative-images)
  - [Style Directives](#style-directives)
    - [Prerequisite: `remark-directive`](#prerequisite-remark-directive)
  - [Include directive](#include-directive)
  - [Component directives](#component-directives)
  - [Add-ons](#add-ons)
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
npm install astro-m2dx
```

...and in your `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import m2dx from 'astro-m2dx';
//                ^^^^^^^^^^

/** @type {import('astro-m2dx').Options} */
const m2dxOptions = {
  // activate any required feature here *
};

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [[m2dx, m2dxOptions]],
    //               ^^^^
    extendDefaultPlugins: true,
  },
});
```

## Use

When adding astro-m2dx to your project, none of the features is active by default, you have to activate them in the Astro configuration (and by providing the respective configuration files, e.g. for per-directory frontmatter).

The following features are available, toggle them by adding the option to your configuration object in the Astro configuration:

### Default Frontmatter

```js
frontmatter: boolean | string | { name?: string, resolvePaths: true };
```

Merge YAML frontmatter files into the frontmatter of MDX files.

The merge is only applied after all file-specific frontmatter items have been added. These will not be overwritten.

- default: `false`, no frontmatter is merged
- `true`, to enable frontmatter merging from files with name
  `_frontmatter.yaml` and without resolving relative paths
- `<name>`, to find frontmatter in YAML files named `<name>`
- `{ name?: string, resolvePaths: true }`, to resolve relative paths from
  the merged frontmatter file with respect to that file

Now you can create frontmatter YAML files with the defined name in your `src` directory to define common properties.

All files up the directory tree are merged into the frontmatter, with values from the files frontmatter taking highest precedence and values from frontmatter files furthest up the tree taking least precedence. Object properties will be deeply merged, `Array`, `Date` and `Regex` objects will **not** be merged.

A very simple frontmatter file defining a default layout for all MDX files in a directory:

```yaml
layout: @layouts/BlogLayout.astro
```

> ⚠️ Beware of relative references inside these files: The values are merged as-is and hence will be relative to the receiving MDX file and not the default frontmatter-file. It is safer to define `paths` in your tsconfig.json.  
> 🦊 You can now specify `resolvePaths: true` to have your relative paths resolved with respect to the \_frotnmatter.yaml file.

### Export Components

```js
exportComponents: boolean | string;
```

Merge ESM component mapping-files into the exported `components` object of MDX files.

- default: `false`, no component mapping is merged
- `true`, to enable component mapping merging from files with name `_components.ts`
- `<name>`, to find component mapping-files with `<name>`

In Astro you can define a mapping from HTML elements to JSX components in any MDX file by exporting a constant object `components`. With this feature you can define this export per directory, by creating an ESM file exporting a `components` constant object expression, that maps HTML tags to JSX components:

```js
import { Title } from '@components/Title';

export const components = {
  h1: Title,
};
```

All files up the directory tree are merged, with mappings from the MDX file itself taking highest precedence and mappings from files furthest up the tree taking least precedence.

### Auto-imports

```js
autoImports: boolean | string;
```

Add imports for known JSX components in MDX files automatically.

- default: `false`, no components are imported automatically
- `true`, to enable automatic imports from files with name `_autoimports.ts`
- `<name>`, to find automatic imports in files named `<name>`

Now create an auto-import file exporting known components:

```js
import { Code } from 'astro/components';

export const autoimports = {
  Code,
};
```

> Despite the suffix of the default value, these files should be simple ESM files (i.e. ES >=6) and not use any none-ES TypeScript features, because we need to parse them using [`acorn`](https://www.npmjs.com/package/acorn)

In your MDX file you can now use `<Code ... />` without importing it:

```md
# My Title

Here I am embedding some fancy code from the frontmatter:

<Code code={frontmatter.rawmdx} />
```

You can structure your export pretty much as you like, as long as the variable initialization is an object expression without spread operator. Files are evaluated up the directory tree, i.e. files closer to the MDX file take precedence over files further up the tree.

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

Auto-imports have one sub-option

```js
autoImportsFailUnresolved: boolean;
```

Fail if unresolved components cannot be resolved by autoImports.

- default: `false`
- `true` to throw an error on unresolved components

### Relative Images

```js
relativeImages: boolean;
```

Resolve relative image references in MDX files.

- default: `false`
- `true`, to enable relative image resolution

All relative image references (textual values) with a resolvable reference are replaced with an imported image reference in the compiled MDX.

Original MDX

```mdx
![My alt text] (my-image.png "Fancy Title")
```

will be interpreted as if you wrote

```mdx
import rel_image__0 from './my-image.png';

<img alt="My alt text" src={rel_image__0} title="Fancy Title" />
```

The resolution will also be applied to obviously relative image references in JSX components, i.e. any attribute value that starts with `./` or `../` and has typical image suffixes will be replaced by a `MdxJsxAttributeValueExpression` similar to the above.

### Style Directives

```js
styleDirectives: boolean;
```

Apply classes from style directive to surrounding element.

- default: `false`
- `true`, to apply classes to surrounding element

The directive `style` is supported in all three directive forms

- container - `:::style{.some-class} ... :::` around a list of elements
- leaf - `::style{.some-class}` inside container elements
- text - `:style{.some-class}` inside paragraphs or spans

Leaf and text directive will apply the classes from the directive to the parent element and remove the directive from the MDAST. Using the container form will apply the class to the generic `<div>` element that is created by the directive itself, i.e. the following MDX snippet

```md
:::style{.bg-accent}

## Chapter 1

::style{.decent}

A lot of text here.

:::
```

will result in this HTML

```html
<div class="bg-accent decent">
  <h2>Chapter 1</h2>
  <p>A lot of text here.</p>
</div>
```

As you can see, if the classes from multiple directives are applied to the same element, the class list is joined (the class `decent` from the leaf directive is applied to its containing element, which in this case is the generic `<div>` element from the container style directive).

Because lists are not present in Markdown as such (only the list items), style could not be applied to the list as a whole. Therefore, there is a special directive `::list-style` that applies the classes from the directive to the succeeding list, if there is one, i.e.

```md
::list-style{.nav}

- Home
- Blog
- Docs
```

will result in this HTML

```html
<ul class="nav">
  <li>Home</li>
  <li>Blog</li>
  <li>Docs</li>
</ul>
```

#### Prerequisite: `remark-directive`

> ⚠️ In order to use this feature, you must insert the plugin `remark-directive` before `astro-m2dx`.

```js
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import m2dx from 'astro-m2dx';
import remarkDirective from 'remark-directive';

/** @type {import('astro-m2dx').Options} */
const m2dxOptions = {
  styleDirectives: true,
};

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [
      remarkDirective, // required for styleDirectives
      [m2dx, m2dxOptions],
    ],
    extendDefaultPlugins: true,
  },
});
```

> One final request: This feature allows to mix content and representation, use carefully and prefer semantic class names over visual ones (I know the examples use some visual ones ;-()

### Include directive

```js
includeDirective: boolean | string;
```

Include other MDX files in your MDX file with a
`::include[./partial.mdx]` directive

- default: `false`
- `true`, to enable this directive with the name `::include`
- `<name>`, to enable the directive with name `::<name>[./ref.mdx]`

This feature renders the included MDX file without modification as loaded from its origin, i.e. if its (merged) frontmatter contains a `layout`, then it will be rendered including the layout.

The directive recognizes the option `unwrap`, that inserts the included file into the parent directly after the node that contains the directive. This can be handy, e.g. if you sectionize your markdown according to headings and want to insert a section inbetween sections:

```mdx
## Section 1

::include[./section2.mdx]{unwrap}

## Section 3
```

Without the option unwrap, the `section2.mdx` would always be inluded in the section created for 'Section 1'.

> ⚠️ In order to use this feature, you must insert the plugin `remark-directive` before `astro-m2dx`.

### Component directives

```js
componentDirectives: boolean | string;
```

Map generic markdown directives to JSX components.

- default: `false`, no directives are mapped to components
- `true`, to enable mapping directives to components according to files
  with name `_directives.ts`
- `<name>`, to find directive mappings in files named `<name>`

These files should be simple JavaScript/ESM files (i.e. ES >=6), e.g.

```js
import { CTA } from '@components/CTA';

export const directives = {
  callToAction: CTA,
};
```

...and then use it in your Markdown like this:

```md
::CTA[Dear Astronauts, grab your vacuum cleaner and dust off your MDX, now!]{href="https://www.npmjs.com/package/astro-m2dx"}
```

⚠️ Limitation: The names of the defined directives must be valid ES variable names, i.e. you can only use names, that you do not need to quote (especially: no snake-case).

### Add-ons

```js
  addOns: AddOn[];
```

Apply any custom transformations to the MDAST.

- default: none
- Set of transformer functions that are executed after all internal astro-m2dx transformations

### Inject Raw MDX

```js
rawmdx: boolean | string;
```

Inject the raw MDX into the frontmatter.

- default: `false`
- `true`, to have it injected into property `rawmdx`
- `<name>`, to have it injected as property `<name>`

### Inject MDAST

```js
mdast: boolean | string;
```

Inject the MD AST into the frontmatter.

- default: `false`
- `true`, to have it injected into property `mdast`
- `<name>`, to have it injected as property `<name>`

> The injected tree is not read by the HTML generation, so manipulation does not make sense.

### Scan Title

```js
scanTitle: boolean | string;
```

Scan the content for the title and inject it into the frontmatter.

- default: `false`
- `true`, to have it injected into property `title`
- `<name>`, to have it injected as property `<name>`

The title will be taken from the first heading with depth=1,
i.e. the first line `# My Title`.

If the frontmatter already has a property with that name, it will **NOT** be overwritten.

### Scan Abstract

```js
scanAbstract: boolean | string;
```

Scan the content for the abstract and inject it into the frontmatter.

- `true`, to have it injected into property `abstract`
- `<name>`, to have it injected as property `<name>`
- default: `false`

The abstract will be taken from the content between the title and the next
heading. It will only be textual content.

If the frontmatter already has a property with that name, it will **NOT** be overwritten.
