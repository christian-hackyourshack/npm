# mem-cache

Simple typed in-memory cache for stateless functions.

## Content

- [Content](#content)
- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)

## What is this?

This package is a simple TypeScript class, that allows to wrap a stateless function in a cache.

## When should I use this?

If you have a computation-intensive or I/O-heavy (quasi) stateless function, that will return the same value for each invocation with the same parameters, then you can wrap it into this cache and use cached values for repeated calls.

> I use it e.g. in a Static Site Generator to access values from configuration files.

## Install

```sh
npm install -D mem-cache
```

## Use

```js
function expensiveComputation(a: string, b: number) {
  return `${a} - ${b}`;
}
const cachedComputation = new MemCache(expensiveComputation);

const result = cachedComputation.get('a', 8);
```

Of course, you can also use arrow functions to initialize the cache:

```js
const cachedComputation = new MemCache((a: string, b: number): string => {
  return `${a} - ${b}`;
});
```
