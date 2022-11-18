# m2dx-utils

## 0.2.3

### Patch Changes

- [`cd79a13`](https://github.com/christian-hackyourshack/npm/commit/cd79a138419d83c06e8b920339f86407c2a77403) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Added feature 'normalizePaths'

## 0.2.2

### Patch Changes

- [`5e7c2f0`](https://github.com/christian-hackyourshack/npm/commit/5e7c2f0b0effd0660f1fb9ded44e16daf7b0000b) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Fixed an issue in embeddedHast.addHClasses

## 0.2.1

### Patch Changes

- [`05091a9`](https://github.com/christian-hackyourshack/npm/commit/05091a9f6c301026a171276ff86ba9ef154f81a6) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Refactored handling of embedded HAST to public util

## 0.2.0

### Minor Changes

- [`bc57d1c`](https://github.com/christian-hackyourshack/npm/commit/bc57d1c1c561671a43b9ad0b776986a8604e101e) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Removed CJS modules from build

  Astro (or probably the underlying Vite) would hick-up on the CJS files in the packages and prefer them over the ESM, resulting in not being able to load Remark (which is ESM only).

## 0.1.0

### Minor Changes

- [`2ee447a`](https://github.com/christian-hackyourshack/npm/commit/2ee447ad7631750c84ab69175aa7da134b3fb1f5) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Refactored the CI/CD setup
