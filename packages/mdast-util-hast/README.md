# mdast-util-hast

Utilities to work with hast attributes in mdast.

## Content

- [Content](#content)
- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)

## What is this?

This package provides a few helper functions to add hast properties to your mdast. With the following functions you can control the generated HTML:

- `getHProperties`: get the hProperties and set any property on the generated HTML element
- `addHClasses`: sets the hProperty `class` and makes sure not to introduce duplicates
- `setHName`: set the tag name of the HTML element

## When should I use this?

If you want to add hast attributes to your mdast in order to control the generated HTML.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with `npm`:

```sh
npm install mdast-util-hast
```

## Use

This is still in very early alpha, hence, I can only provide very little documentation.

Use at your own risk.
