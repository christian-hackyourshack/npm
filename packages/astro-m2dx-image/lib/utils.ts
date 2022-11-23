import type { TransformOptions } from '@astrojs/image/dist/loaders';
import type { ImageMetadata } from '@astrojs/image/dist/vite-plugin-astro-image';
import type { PictureProps } from '.';

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

export function getDimensions(props: PictureProps): { width?: number; height?: number } {
  const { width, height, aspectRatio, src } = props;
  const result = { width, height };
  if (isImageMetadata(src)) {
    if (!width && !height && !aspectRatio) {
      result.width = src.width;
      result.height = src.height;
    } else if (!width || !height) {
      const _aspectRatio =
        parseAspectRatio(aspectRatio) ?? //
        getIntrinsicAspectRatio(src);
      if (_aspectRatio) {
        if (width) {
          result.height = Math.round(width / _aspectRatio);
        } else if (height) {
          result.width = Math.round(height * _aspectRatio);
        } else {
          result.width = src.width;
          result.height = Math.round(result.width / _aspectRatio);
        }
      }
    }
  }
  return result;
}

export function getIntrinsicAspectRatio(src: ImageMetadata): number {
  return src.width / (src.height ?? 1);
}

export function getSrc(src: string | ImageMetadata): string {
  return typeof src === 'string' ? src : src.src;
}
