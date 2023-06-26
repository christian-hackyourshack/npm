# astro-art-direction

[Astro](https://astro.build) components and utilities wrapping [@astrojs/image](https://docs.astro.build/en/guides/integrations-guide/image/) for easier use of local images in HTML `image` and particularly `picture` elements. This is especially helpful, when mapping standard markdown `img` nodes from [MDX](https://mdxjs.com) files, because it can derive all required information from the local image file.

## Content

- [Content](#content)
- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
  - [Simple use in Astro files](#simple-use-in-astro-files)
  - [Mapping markdown images to `Picture`](#mapping-markdown-images-to-picture)
  - [Custom `Picture` component](#custom-picture-component)
  - [Callback](#callback)

## What is this?

This package is a source distribution of an Astro component, which ease working with images in HTML `picture` elements, without need for manual provision of any parameters, i.e. it is particularly useful when mapping markdown `img` nodes.

**Art direction** is supported through the use of the `class` attribute, which can be mapped to arbitrary parameters of the component by means of a callback. If you want to use art direction in markdown files, you could use the remark plugin [`remark-class-directive`](https://www.npmjs.com/package/remark-class-directive) to annotate your markdown with `:class`-directives.

**Local images** should be referenced by absolute file paths, so that the underlying image optimization can pick them up easily to compute missing values from the original image data. If you want to work with relative paths in your markdown files, you could use the remark plugin [`remark-normalize-paths`](https://www.npmjs.com/package/remark-normalize-paths) to convert them to absolute paths.

## When should I use this?

If you want to make use of all the goodies of HTML `picture` elements, i.e. image optimization, art direction, etc. without needing to worry about all the intricacies of it. It is particular useful, when you map regular markdown image syntax, i.e. `![Alt text](./my-url.jpg)`, to the `<Picture>` component.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with `npm`:

```sh
npm install astro-local-image
```

## Use

### Simple use in Astro files

```astro
---
import { Picture } from 'astro-local-image';
---

<Picture src="./my-image.jpg" alt="My image" />
```

### Mapping markdown images to `Picture`

```ts
import { Picture } from 'astro-local-image';

export const components = {
  img: Picture,
};
```

### Custom `Picture` component

You can easily implement a custom component, by defining some default properties

```ts
---
import { Picture, PictureProps } from 'astro-local-image';

const props = Astro.props as PictureProps;

const customProps: PictureProps = {
  aspectRatio: 1,
  loading: props.class?.includes('eager') ? 'eager' : undefined,
  position: 'attention',
  sizes: '(min-width: 360px) 240px, 100vw',
  widths: [240, 480],
  ...props,
};
---

<Picture {...customProps} />
```

For the property `loading`, you can see a typical pattern, that I use for art direction: I usually derive some properties from classes, that I attach to images, using remark-class-directive `:class`-directive

```md
![My fantastic hero image](./hero.jpg):class{.eager}
```

### Callback

If you have the need to compute some props based on all defined props including a resolved `src` property, you can configure a `callback` function `(props: PictureProps) => PictureProps`, that can set any property.

A typical use case would be, to limit the aspect ratio to some boundaries.
