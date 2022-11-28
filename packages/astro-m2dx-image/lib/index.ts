import type { AspectRatio } from './types';
export { default as Image } from './Image.astro';
export { default as Picture } from './Picture.astro';
export * from './types';

// This cannot be simply reexported, because of some rollup issues when using the package
export function parseAspectRatio(aspectRatio?: AspectRatio): number | undefined {
  if (!aspectRatio) {
    return undefined;
  }
  if (typeof aspectRatio === 'number') {
    return aspectRatio;
  } else {
    const [width, height] = aspectRatio.split(':');
    return parseInt(width) / parseInt(height);
  }
}
