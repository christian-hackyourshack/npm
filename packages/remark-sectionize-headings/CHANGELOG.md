# remark-sectionize-headings

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
