# Changelog

## 0.1.2

### Patch Changes

- [#70](https://github.com/christian-hackyourshack/npm/pull/70) [`6de1a2a`](https://github.com/christian-hackyourshack/npm/commit/6de1a2ae731dfc605cdf056b7ae1f65381a29cf3) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Continued pulling out remark plugins from astro-m2dx

## 0.1.1

### Patch Changes

- [#68](https://github.com/christian-hackyourshack/npm/pull/68) [`8f8049c`](https://github.com/christian-hackyourshack/npm/commit/8f8049c079c3e0491800cdba00440d47f4946bd6) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Updated documentation and tests

## 0.2.3

### Patch Changes

- [`4cbc77a`](https://github.com/christian-hackyourshack/npm/commit/4cbc77a2a39a21e521b68216b89da61263ef976a) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Fixed an issue with nesting of sections

## 0.2.2

### Patch Changes

- [`d8355e5`](https://github.com/christian-hackyourshack/npm/commit/d8355e519d8e5bffdf7354790a9fbf679d51ea1d) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Fixed passing down of new option

## 0.2.1

### Patch Changes

- [`9c13796`](https://github.com/christian-hackyourshack/npm/commit/9c137968ebd8c3dbf348a70aac8ac0ada2a72bfc) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Added option to modify generated classes

## 0.2.0

### Minor Changes

- [`bc57d1c`](https://github.com/christian-hackyourshack/npm/commit/bc57d1c1c561671a43b9ad0b776986a8604e101e) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Removed CJS modules from build

  Astro (or probably the underlying Vite) would hick-up on the CJS files in the packages and prefer them over the ESM, resulting in not being able to load Remark (which is ESM only).

## 0.1.0

### Minor Changes

- [`2ee447a`](https://github.com/christian-hackyourshack/npm/commit/2ee447ad7631750c84ab69175aa7da134b3fb1f5) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Refactored the CI/CD setup

## 0.0.1

### Patch Changes

- [`350a5ba`](https://github.com/christian-hackyourshack/npm/commit/350a5bac03c29467955a90ce055bb4219852dfe5) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Initial release
