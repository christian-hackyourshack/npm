import type { TransformOptions } from '@astrojs/image/dist/loaders';
import type { ImageMetadata } from '@astrojs/image/dist/vite-plugin-astro-image';

export function parseAspectRatio(aspectRatio: TransformOptions['aspectRatio']) {
  if (!aspectRatio) {
    return undefined;
  }

  // parse aspect ratio strings, if required (ex: "16:9")
  if (typeof aspectRatio === 'number') {
    return aspectRatio;
  } else {
    const [width, height] = aspectRatio.split(':');
    return parseInt(width) / parseInt(height);
  }
}

export function isImageMetadata(src: unknown): src is ImageMetadata {
  if (src && typeof src === 'object') {
    return (
      typeof (src as ImageMetadata).width === 'number' &&
      typeof (src as ImageMetadata).height === 'number'
    );
  }
  return false;
}
