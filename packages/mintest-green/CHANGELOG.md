# mintest-green

## 0.2.1

### Patch Changes

- [`e77fa27`](https://github.com/christian-hackyourshack/npm/commit/e77fa27288574bddf1aaaf37f82eee24dd5f5518) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Upgraded dependencies

## 0.2.0

### Minor Changes

- [`bc57d1c`](https://github.com/christian-hackyourshack/npm/commit/bc57d1c1c561671a43b9ad0b776986a8604e101e) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Removed CJS modules from build

  Astro (or probably the underlying Vite) would hick-up on the CJS files in the packages and prefer them over the ESM, resulting in not being able to load Remark (which is ESM only).

## 0.1.0

### Minor Changes

- [`26a80fd`](https://github.com/christian-hackyourshack/npm/commit/26a80fdadf41ebe33a6ff64860d8d6cc4fa3038d) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Improved CI/CD workflow

  - packages are checked now before publication
  - build artifacts are merged into fewer files

## 0.0.3

### Patch Changes

- [`22638ee`](https://github.com/christian-hackyourshack/npm/commit/22638eeca5d9a2d938cd0f285d5ac780c4bc7bf9) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Transpiled mintest.ts for better interoperability

## 0.0.2

### Patch Changes

- [`23fe58e`](https://github.com/christian-hackyourshack/npm/commit/23fe58efc79a293c631724243b71a2e98a076e05) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Added binary runner (tsx based)

- [`4a7180e`](https://github.com/christian-hackyourshack/npm/commit/4a7180e50ee666d7da6bdcc61398db3160292f55) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Added snapshot feature

## 0.0.1

### Patch Changes

- [`ee30371`](https://github.com/christian-hackyourshack/npm/commit/ee30371308b1e9a8a70f1f19203c9485feabd20a) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Initial commit for minimalistic test-runner
