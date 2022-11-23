# astro-m2dx-image

## 0.0.6

### Patch Changes

- [`4f43576`](https://github.com/christian-hackyourshack/npm/commit/4f43576993b0a2b143c3308db684514dcf09c67b) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Improved typing of Image and Picture

## 0.0.5

### Patch Changes

- [`a2983cd`](https://github.com/christian-hackyourshack/npm/commit/a2983cdf38c15d524b52686574707cb356851e98) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Fix: Exporting CallbackProps

## 0.0.4

### Patch Changes

- [`27813d8`](https://github.com/christian-hackyourshack/npm/commit/27813d830d08fc670cdd797cfd2c09c25cc43814) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Added few more utilities to work with Picture

  - getIntrinsicAspectRatio
  - getSrc

  Also simplified getDimensions and improved typing of callback.

## 0.0.3

### Patch Changes

- [`b3338d5`](https://github.com/christian-hackyourshack/npm/commit/b3338d50562397f7fd5b2c11e1d4a69a75ef3463) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Resorted to patched Picture component to eliminate CLS

  Due to Github PR https://github.com/withastro/astro/pull/4797, the Picture component removes width and height from the embedded img. That causes massive layout shifts.

  The patched component reverts that change until it is reverted in the Astro repo.

## 0.0.2

### Patch Changes

- [`5e5a020`](https://github.com/christian-hackyourshack/npm/commit/5e5a0200f239bcb2f9c1c3fe5e776d330dec3ff3) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Bug fixes

  - removed duplicate width/height attributes from img in picture
  - replaced number-based img ids with hash-based

## 0.0.1

### Patch Changes

- [`eef73f2`](https://github.com/christian-hackyourshack/npm/commit/eef73f2f2d791814604237911cad17f18df681b7) Thanks [@christian-hackyourshack](https://github.com/christian-hackyourshack)! - Initial release

  Providing wrapper components around @astrojs/image to be used in MDX setups.
