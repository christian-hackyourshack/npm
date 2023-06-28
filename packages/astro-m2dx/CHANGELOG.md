# astro-m2dx

## 0.7.16

### Patch Changes

- [#89](https://github.com/christian-hackyourshack/npm/pull/89) [`2dae58e`](https://github.com/christian-hackyourshack/npm/commit/2dae58ea85eb656895c98d8703be7aae1593a1c4) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Updated dependencies

- Updated dependencies [[`2dae58e`](https://github.com/christian-hackyourshack/npm/commit/2dae58ea85eb656895c98d8703be7aae1593a1c4)]:
  - m2dx-utils@0.2.6

## 0.7.15

### Patch Changes

- [`6856a7c`](https://github.com/christian-hackyourshack/npm/commit/6856a7cd9e1bb3d3a169f06bbc76249c20079432) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Added option to apply styles to included partials

- Updated dependencies []:
  - m2dx-utils@0.2.5

## 0.7.14

### Patch Changes

- [`e77fa27`](https://github.com/christian-hackyourshack/npm/commit/e77fa27288574bddf1aaaf37f82eee24dd5f5518) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Upgraded dependencies

- Updated dependencies [[`e77fa27`](https://github.com/christian-hackyourshack/npm/commit/e77fa27288574bddf1aaaf37f82eee24dd5f5518)]:
  - m2dx-utils@0.2.5

## 0.7.13

### Patch Changes

- Updated dependencies [[`f31cce6`](https://github.com/christian-hackyourshack/npm/commit/f31cce6027030ce0da4f72e16f96600843cb4a6e)]:
  - m2dx-utils@0.2.4

## 0.7.12

### Patch Changes

- [`5e5a020`](https://github.com/christian-hackyourshack/npm/commit/5e5a0200f239bcb2f9c1c3fe5e776d330dec3ff3) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Bug fixes

  - removed duplicate width/height attributes from img in picture
  - replaced number-based img ids with hash-based

## 0.7.11

### Patch Changes

- [`cd79a13`](https://github.com/christian-hackyourshack/npm/commit/cd79a138419d83c06e8b920339f86407c2a77403) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Added feature 'normalizePaths'

- [`9b66f23`](https://github.com/christian-hackyourshack/npm/commit/9b66f23e714ab360c96af1c2245cd5cb0ae04df6) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Added new features: unwrapImages & identifyImages

- Updated dependencies [[`cd79a13`](https://github.com/christian-hackyourshack/npm/commit/cd79a138419d83c06e8b920339f86407c2a77403)]:
  - m2dx-utils@0.2.3

## 0.7.10

### Patch Changes

- Updated dependencies [[`5e7c2f0`](https://github.com/christian-hackyourshack/npm/commit/5e7c2f0b0effd0660f1fb9ded44e16daf7b0000b)]:
  - m2dx-utils@0.2.2

## 0.7.9

### Patch Changes

- [`05091a9`](https://github.com/christian-hackyourshack/npm/commit/05091a9f6c301026a171276ff86ba9ef154f81a6) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Refactored handling of embedded HAST to public util

- Updated dependencies [[`05091a9`](https://github.com/christian-hackyourshack/npm/commit/05091a9f6c301026a171276ff86ba9ef154f81a6)]:
  - m2dx-utils@0.2.1

## 0.7.8

### Patch Changes

- [`d3dcc67`](https://github.com/christian-hackyourshack/npm/commit/d3dcc67b9858b94ae97d1df39fe5fd9d970c6a1b) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Applying text :style directives to direct predecessors (except text)

## 0.7.7

### Patch Changes

- [`95e225e`](https://github.com/christian-hackyourshack/npm/commit/95e225e5943b439acb960914737bbc60316f4edd) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Added option 'unwrap' to includeDirective

- [`1a608b2`](https://github.com/christian-hackyourshack/npm/commit/1a608b2dc129a868cf5d070c3fd2bdfff3941751) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Fixed Vite path conflict for all imports

## 0.7.6

### Patch Changes

- [`9bdf033`](https://github.com/christian-hackyourshack/npm/commit/9bdf033c11ad2566ed3662e589000d6d0cdd6d5d) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Fixed a Windows path conflict with Vite

  Vite seems to do manual path manipulation in some places, expecting those paths to be Linux, e.g. I found this issue: https://github.com/vitejs/vite/issues/2422. That specific one does not matter to us, but I suspect more of those places.

  This fix un-normalizes Windows paths to Linux paths, before feeding them to Vite.

## 0.7.5

### Patch Changes

- [`2fb46d6`](https://github.com/christian-hackyourshack/npm/commit/2fb46d68907d929457a3603cf669229622a549f1) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Allowing non-async AddOn functions

## 0.7.4

### Patch Changes

- [`fdbb7db`](https://github.com/christian-hackyourshack/npm/commit/fdbb7db0486dc81cc3c5876aefbdf637e345924c) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Added option to resolve paths during frontmatter merge

## 0.7.3

### Patch Changes

- [`2a52d45`](https://github.com/christian-hackyourshack/npm/commit/2a52d45ff5eed6c0ea536a9eef55c194c868509f) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Another fix: Resolved issue with multiple relative images

## 0.7.2

### Patch Changes

- [`a523825`](https://github.com/christian-hackyourshack/npm/commit/a523825f85954a13b49b38211acf6ff6e4e48d30) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Fixed an issue with relative images and includes

## 0.7.1

### Patch Changes

- [`eb0a742`](https://github.com/christian-hackyourshack/npm/commit/eb0a7425f54a5cf6a89b852bc0a7a4db349dba53) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Fixed reference of imported image component for relative images

## 0.7.0

### Minor Changes

- [`112e59c`](https://github.com/christian-hackyourshack/npm/commit/112e59c587cd98a1741a6ac25ed8e2f130e44221) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - relative images are now potentially converted to a JSX component directly

### Patch Changes

- [`bd2831e`](https://github.com/christian-hackyourshack/npm/commit/bd2831e3cdb51bedfff610d1e1a42a27e8ca03a2) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Added option for custom name of style directives

- [`f0112ac`](https://github.com/christian-hackyourshack/npm/commit/f0112acde46c65f5eed4f12a9dc3589eb0398f7b) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Added transfer of all hProperties for created img element

## 0.6.2

### Patch Changes

- [`41169f7`](https://github.com/christian-hackyourshack/npm/commit/41169f70997b6bebec6f211de90167a47022ccfc) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Replaced node:crypto/shake256 based shortHash with dependency free implementation.

## 0.6.1

### Patch Changes

- [`baa2599`](https://github.com/christian-hackyourshack/npm/commit/baa25992831a983bb5e4474799a5291e44a7d12a) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Allowing :style directives with content now also for leaf and text directive

## 0.6.0

### Minor Changes

- [`bc57d1c`](https://github.com/christian-hackyourshack/npm/commit/bc57d1c1c561671a43b9ad0b776986a8604e101e) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Removed CJS modules from build

  Astro (or probably the underlying Vite) would hick-up on the CJS files in the packages and prefer them over the ESM, resulting in not being able to load Remark (which is ESM only).

### Patch Changes

- Updated dependencies [[`bc57d1c`](https://github.com/christian-hackyourshack/npm/commit/bc57d1c1c561671a43b9ad0b776986a8604e101e)]:
  - m2dx-utils@0.2.0

## 0.5.1

### Patch Changes

- [`1360d78`](https://github.com/christian-hackyourshack/npm/commit/1360d78c15f8cc214acd0909efb3ce584b4da4ac) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Improved robustness of componentDirective

## 0.5.0

### Minor Changes

- [`26a80fd`](https://github.com/christian-hackyourshack/npm/commit/26a80fdadf41ebe33a6ff64860d8d6cc4fa3038d) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Improved CI/CD workflow

  - packages are checked now before publication
  - build artifacts are merged into fewer files

### Patch Changes

- Updated dependencies []:
  - m2dx-utils@0.1.0

## 0.4.6

### Patch Changes

- [`5f35fbe`](https://github.com/christian-hackyourshack/npm/commit/5f35fbe6a385fed0dcbcbf76e486a722f53ce64c) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Added visit helper to mdx index

- [`8ed183c`](https://github.com/christian-hackyourshack/npm/commit/8ed183c569b3c38f32bb2632f0627fde184ccc99) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Moved toText(Node) method to utils

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
