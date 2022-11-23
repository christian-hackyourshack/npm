import type { TransformOptions } from '@astrojs/image/dist/loaders';
import { metadata } from '@astrojs/image/dist/utils/metadata';
import type { ImageMetadata } from '@astrojs/image/dist/vite-plugin-astro-image';
import { existsSync } from 'fs';
import { normalize, relative } from 'path';
import URL from 'url';
import type { ImageProps, PictureProps } from './types';

export async function resolveSrc(props: ImageProps): Promise<void> {
  if (typeof props.src === 'string') {
    let src = props.src;
    if (src.startsWith('file://')) {
      src = URL.fileURLToPath(src);
    }
    src = normalize(src);
    if (existsSync(src)) {
      const data = await metadata(URL.pathToFileURL(src));
      if (data) {
        data.src = './' + relative(process.cwd(), data.src);
        props.src = data;
      }
    }
  } else if ('then' in props.src) {
    props.src = (await props.src).default;
  }
}

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

export function getDimensions({ width, height, aspectRatio, src }: PictureProps): {
  width?: number;
  height?: number;
} {
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

export function getWidth({
  width,
  widths,
  height,
  aspectRatio,
  src,
}: PictureProps): number | undefined {
  if (width) return width;
  if (widths && widths.length > 0) return widths[widths.length - 1];
  if (height && aspectRatio) {
    const _aspectRatio = parseAspectRatio(aspectRatio);
    if (_aspectRatio) {
      return Math.round(height * _aspectRatio);
    }
  }
  if (isImageMetadata(src)) {
    if (aspectRatio) {
      const _aspectRatio = parseAspectRatio(aspectRatio);
      if (_aspectRatio) {
        return Math.round(Math.min(src.width, src.height * _aspectRatio));
      }
    }
    if (height) {
      const _aspectRatio = getIntrinsicAspectRatio(src);
      return Math.round(height * _aspectRatio);
    }
    return src.width;
  }
  return undefined;
}

export function getHeight({ height, width, aspectRatio, src }: PictureProps): number | undefined {
  if (height) return height;
  if (width && aspectRatio) {
    const _aspectRatio = parseAspectRatio(aspectRatio);
    if (_aspectRatio) {
      return Math.round(width / _aspectRatio);
    }
  }
  if (isImageMetadata(src)) {
    if (aspectRatio) {
      const _aspectRatio = parseAspectRatio(aspectRatio);
      if (_aspectRatio) {
        return Math.round(Math.min(src.height, src.width / _aspectRatio));
      }
    }
    if (width) {
      const _aspectRatio = getIntrinsicAspectRatio(src);
      return Math.round(width / _aspectRatio);
    }
    return src.width;
  }
  return undefined;
}

export function getIntrinsicAspectRatio(src: ImageMetadata): number {
  return src.width / (src.height ?? 1);
}

export function getSrc(src: string | ImageMetadata): string {
  return typeof src === 'string' ? src : src.src;
}
