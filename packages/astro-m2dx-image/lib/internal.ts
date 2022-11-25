import type { InputFormat } from '@astrojs/image/dist/loaders';
import { metadata } from '@astrojs/image/dist/utils/metadata';
import { existsSync } from 'fs';
import { extname, normalize, relative } from 'path';
import URL from 'url';
import type { AspectRatio, CallbackProps, ImageMetadata } from './types';

export async function resolveSrc(
  src: string | ImageMetadata | Promise<{ default: ImageMetadata }>
): Promise<ImageMetadata> {
  if (typeof src === 'string') {
    if (src.startsWith('file://')) {
      src = URL.fileURLToPath(src);
    }
    src = normalize(src);
    if (existsSync(src)) {
      const data = await metadata(URL.pathToFileURL(src));
      if (data) {
        data.src = './' + relative(process.cwd(), data.src);
        return data;
      }
    }
    // TODO: optionally download remote image
    return {
      src,
      width: 0,
      height: 0,
      format: extname(src).replace('.', '') as InputFormat,
    };
  } else if ('then' in src) {
    return (await src).default;
  }
  return src as ImageMetadata;
}

export function getAspectRatio(props: CallbackProps): AspectRatio | undefined {
  return (
    props.aspectRatio ?? //
    computeAspectRatio(props.width, props.height) ??
    computeAspectRatio(props.src.width, props.src.height)
  );
}

function computeAspectRatio(width?: number, height?: number) {
  if (width && height) {
    return width / height;
  }
  return undefined;
}

export function getFallbackAspectRatio(src: string, alt?: string): number {
  const fallback = 1;
  console.warn(
    `\n[astro-m2dx-image] "aspectRatio" was not provided and could not be derived for\n<Image/Picture src="${src}" alt="${alt}" ... />\nusing a random default value of "${fallback}", which is possibly not what you want.\n`
  );
  return fallback;
}

export function getFallbackWidth(src: string, alt?: string): number {
  const fallback = 480;
  console.warn(
    `\n[astro-m2dx-image] "width" was not provided and could not be derived for\n<Image src="${src}" alt="${alt}" ... />\nusing a random default value of "${fallback}", which is possibly not what you want.\n`
  );
  return fallback;
}

export function getFallbackWidths(src: string, alt?: string): number[] {
  const fallback = [480];
  console.warn(
    `\n[astro-m2dx-image] "widths" was not provided and could not be derived for\n<Picture src="${src}" alt="${alt}" ... />\nusing a random default value of "${fallback}", which is possibly not what you want.\n`
  );
  return fallback;
}

export function warnForMissingAlt(src: string) {
  console.warn(
    `\n[astro-m2dx-image] "alt" text was not provided for <Image/Picture src="${src}" ... />.\n`
  );
}
