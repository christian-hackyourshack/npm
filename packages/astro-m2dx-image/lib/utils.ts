import { metadata } from '@astrojs/image/dist/utils/metadata';
import { existsSync } from 'fs';
import { normalize, relative } from 'path';
import URL from 'url';
import type { AspectRatio, ImageMetadata, ImageProps, PictureProps } from './types';

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

export function isImageMetadata(src: unknown): src is ImageMetadata {
  if (src && typeof src === 'object') {
    return (
      typeof (src as ImageMetadata).width === 'number' &&
      typeof (src as ImageMetadata).height === 'number'
    );
  }
  return false;
}

export function parseAspectRatio(aspectRatio: AspectRatio) {
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

export function getAspectRatio({
  aspectRatio,
  width,
  height,
  src,
}: PictureProps): AspectRatio | undefined {
  if (aspectRatio) return aspectRatio;
  if (width && height) {
    return width / height;
  }
  if (isImageMetadata(src) && src.width && src.height) {
    return src.width / src.height;
  }
  return undefined;
}

export function getWidth({
  width,
  widths,
  height,
  aspectRatio,
  src,
}: PictureProps): number | undefined {
  if (width) return width;
  if (height && aspectRatio) {
    const _aspectRatio = parseAspectRatio(aspectRatio);
    if (_aspectRatio) {
      return Math.round(height * _aspectRatio);
    }
  }
  if (widths && widths.length > 0) return widths[widths.length - 1];
  if (isImageMetadata(src)) {
    if (aspectRatio) {
      const _aspectRatio = parseAspectRatio(aspectRatio);
      if (_aspectRatio) {
        return Math.min(src.width, Math.round(src.height * _aspectRatio));
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
        return Math.min(src.height, Math.round(src.width / _aspectRatio));
      }
    }
    if (width) {
      const _aspectRatio = getIntrinsicAspectRatio(src);
      return Math.round(width / _aspectRatio);
    }
    return src.height;
  }
  return undefined;
}

export function getDimensions(props: PictureProps): {
  width?: number;
  height?: number;
} {
  const width = getWidth(props);
  const height = getHeight({ width, ...props });
  return { width, height };
}

export function getIntrinsicAspectRatio(src: ImageMetadata): number {
  return src.width / (src.height ?? 1);
}

export function getSrc(src: string | ImageMetadata): string {
  return typeof src === 'string' ? src : src.src;
}

export function getFallbackAspectRatio(src: string, alt: string): number {
  const fallback = 1;
  console.warn(
    `\n[astro-m2dx-image] "aspectRatio" was not provided and could not be derived for\n<Image/Picture src="${src}" alt="${alt}" ... />\nusing a random default value of "${fallback}", which is possibly not what you want.\n`
  );
  return fallback;
}

export function getFallbackWidth(src: string, alt: string): number {
  const fallback = 480;
  console.warn(
    `\n[astro-m2dx-image] "width" was not provided and could not be derived for\n<Image src="${src}" alt="${alt}" ... />\nusing a random default value of "${fallback}", which is possibly not what you want.\n`
  );
  return fallback;
}

export function getFallbackWidths(src: string, alt: string): number[] {
  const fallback = [480];
  console.warn(
    `\n[astro-m2dx-image] "widths" was not provided and could not be derived for\n<Picture src="${src}" alt="${alt}" ... />\nusing a random default value of "${fallback}", which is possibly not what you want.\n`
  );
  return fallback;
}
