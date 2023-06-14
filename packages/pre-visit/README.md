# pre-visit

Utility function to visit all or some nodes of a generic tree, where children of a node are found in the `children` property. A visitor is applied before visiting the children and siblings, hence it is calle `pre-visit`.

Besides a visitor you can provide a predicate to filter nodes.

It works fine with all kinds of trees, I use it mainly as a typed and more feature rich replacement to `unist-util-visit` to visit remark trees.

## Content

- [Content](#content)
- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)

## What is this?

This package provides a fully typed utility to visit trees and apply a visitor before visiting other nodes.

## When should I use this?

If you want to work with trees and even be able to transform them, while visiting.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with `npm`:

```sh
npm install pre-visit
```

## Use

This is still in very early alpha, hence, I can only provide very little documentation.

Use at your own risk.
