# astro-m2dx

## 0.4.5

### Patch Changes

- [`77169e5`](https://github.com/christian-hackyourshack/npm/commit/77169e540a3b0614cd3f63de4f175a611a6d5703) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Fixed: Tree manipulation skips other children

  Tree manipulation skewed indices of children, hence we now recompute the index after each child

## 0.4.4

### Patch Changes

- [`80baba2`](https://github.com/christian-hackyourshack/npm/commit/80baba241a40006637eb8e1931c29260431e5a5f) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Fixed: Tree manipulation of removing current node skips next child

  Using splice to remove the current node during visit would skip the next child. Now the child array is copied before moving it.

## 0.4.3

### Patch Changes

- [`1632e6f`](https://github.com/christian-hackyourshack/npm/commit/1632e6ff0c702469e7c9db31ba54ddf25f50b253) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Added special cases for styleDirective

  - `<li>` receives class correctly now
  - `<img>` receives class now, if the :style directive is immediately attached to the img

## 0.4.2

### Patch Changes

- [`5d159b7`](https://github.com/christian-hackyourshack/npm/commit/5d159b7e2d119d6fc38288f86a05f789df02060f) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - includeDirective now respects exported components

## 0.4.1

### Patch Changes

- [`0eadc6e`](https://github.com/christian-hackyourshack/npm/commit/0eadc6e9cc0c0d806b2fea57d9c85023d0786238) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Included JSX compoenents from component directives in relative image resolution

## 0.4.0

### Minor Changes

- [`adc0705`](https://github.com/christian-hackyourshack/npm/commit/adc07058ccc689b1688b45409910a608e44e62f6) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Added feature component directives

## 0.3.0

### Minor Changes

- [`33938f9`](https://github.com/christian-hackyourshack/npm/commit/33938f9cd1e764a528d1d33f3e6344177057f5cb) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Added feature includeDirective

## 0.2.0

### Minor Changes

- [`eac523c`](https://github.com/christian-hackyourshack/npm/commit/eac523cd94dbad2712ca9fe445d7ca41127db6c7) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Added remaining open features

  - relativeImages now supports references in JSX component attributes
  - style directives
  - add-on transformers

## 0.1.2

### Patch Changes

- [`f0f8f30`](https://github.com/christian-hackyourshack/npm/commit/f0f8f30ee41f2d7382b31bf31d0b50513639dbe0) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Added a flag to fail on unresolvable JSX components during autoimport

## 0.1.1

### Patch Changes

- [`7546149`](https://github.com/christian-hackyourshack/npm/commit/754614901f1927f29ea6627b1c3ef8e503a757ba) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Relative images: Resolving only for existing reference targets

## 0.1.0

### Minor Changes

- [`13243c5`](https://github.com/christian-hackyourshack/npm/commit/13243c5af4d245be84a7ef7ed348e79d266f9e05) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Added resolution of relative images

## 0.0.2

### Patch Changes

- [`d67c7d9`](https://github.com/christian-hackyourshack/npm/commit/d67c7d9712f17e3ff5881c5535ee2fd06e33c851) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Fixed issue: autoimports would work only if \_components.ts was present

## 0.0.1

### Patch Changes

- [`350a5ba`](https://github.com/christian-hackyourshack/npm/commit/350a5bac03c29467955a90ce055bb4219852dfe5) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Initial release
