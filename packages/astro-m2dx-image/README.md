# astro-m2dx-image

[Astro](https://astro.build) components wrapping [@astrojs/image](https://docs.astro.build/en/guides/integrations-guide/image/) for easier use in [MDX](https://mdxjs.com) files.

Have a look at the [blog post](https://astro-m2dx.netlify.app/blog/working-with-images) to learn more, how to work with optimized images in Astro MDX.

## Content

- [Content](#content)
- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
  - [Simple use of `Image`](#simple-use-of-image)
  - [Simple use of `Picture`](#simple-use-of-picture)
  - [Custom `Picture` component](#custom-picture-component)
  - [Callback](#callback)
- [Detailed Introduction](#detailed-introduction)

## What is this?

This package is a source distribution of Astro components, which ease working with images as they usually appear in markdown files, i.e.

- local images referenced by absolute file paths (relative paths are supported through the use of astro-m2dx [`normalizePaths`](https://astro-m2dx.netlify.app/docs/#normalize-paths)-feature)
- no additional attributes besides `alt`, `src` and `title` (art direction through the class attribute can be implemented through astro-m2dx [`:style`-directives](https://astro-m2dx.netlify.app/docs/#style-directives)

## When should I use this?

If you use [Astro MDX](https://docs.astro.build/en/guides/integrations-guide/mdx/) to generate a site from Markdown files and you want to use optimized images through regular markdown image syntax, i.e. `![Alt text](./my-url.jpg)`.

The components do not rely on [astro-m2dx](https://www.npmjs.com/package/astro-m2dx), but are only tested in the context of it and are best used together with it.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with `npm`:

```sh
npm install astro-m2dx-image
```

## Use

### Simple use of `Image`

The simplest (and least effective) use is, to simply map markdown images to the provided image component in a `_components.ts`

```ts
import { Image } from 'astro-m2dx-image';

export const components = {
  img: Image,
};
```

Do not forget to enable `exportComponents` and `normalizePaths` in your astro-m2dx configuration.

This will give you an optimized image with all the default settings, probably it is not optimized at all, but you could take the image component as a basis to implement your own default settings.

### Simple use of `Picture`

Doing the same as above, but with the `Picture` component will give you access to next generation image formats 'avif' and 'webp'.

```ts
import { Picture } from 'astro-m2dx-image';

export const components = {
  img: Picture,
};
```

### Custom `Picture` component

You can easily implement a custom component, by defining some default properties

```ts
---
import { Picture, PictureProps } from 'astro-m2dx-image';

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

For the property `loading`, you can see a typical pattern, that I use for art direction: I usually derive some properties from classes, that I attach to images, using astro-m2dx `:style`-directive

```md
![My fantastic hero image](./hero.jpg):style{.eager}
```

### Callback

If you have the need to compute some props based on all defined props including a resolved `src` property, you can configure a `callback` function `(props: PictureProps) => PictureProps`, that can set any property.

A typical use case would be, to limit the aspect ratio to some boundaries.

## Detailed Introduction

For a detailed introduction, have a look at the astro-m2dx blog post ["Working with images"](https://astro-m2dx.netlify.app/blog/working-with-images).
