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

export function getDimensions(props: PictureProps) {
  let result: { width?: number; height?: number } | undefined;
  if (isImageMetadata(props.src)) {
    if (!props.width && !props.height && !props.aspectRatio) {
      result = {};
      result.width = props.src.width;
      result.height = props.src.height;
    } else if (!props.width || !props.height) {
      const aspectRatio =
        parseAspectRatio(props.aspectRatio) ?? props.src.width / (props.src.height ?? 1);
      if (aspectRatio) {
        if (props.width) {
          result = {};
          result.width = props.width;
          result.height = Math.round(result.width / aspectRatio);
        } else if (props.height) {
          result = {};
          result.height = props.height;
          result.width = Math.round(result.height * aspectRatio);
        } else {
          result = {};
          result.width = props.src.width;
          result.height = Math.round(result.width! / aspectRatio);
        }
      }
    }
  }
  return result;
}
