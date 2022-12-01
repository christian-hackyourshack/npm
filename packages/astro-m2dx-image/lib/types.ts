import type { ImgHTMLAttributes } from '@astrojs/image/components';
import type { OutputFormat, TransformOptions } from '@astrojs/image/dist/loaders';
import type { ImageMetadata } from '@astrojs/image/dist/vite-plugin-astro-image';

export type { ImageMetadata };

export type AspectRatio = TransformOptions['aspectRatio'];
export type Background = TransformOptions['background'];
export type Decoding = HTMLImageElement['decoding'];
export type Fit = TransformOptions['fit'];
export type Format = TransformOptions['format'];
export type Loading = HTMLImageElement['loading'];
export type Position = TransformOptions['position'];

export interface ImageProps
  extends Omit<TransformOptions, 'src'>,
    Omit<ImgHTMLAttributes, 'slot' | 'alt' | 'src' | 'width' | 'height'> {
  /** Defines an alternative text description of the image. Set to an empty string (alt="") if the image is not a key part of the content (it's decoration or a tracking pixel). */
  alt: string;
  src: string | ImageMetadata | Promise<{ default: ImageMetadata }>;
}

/**
 * The Picture environment tries to resolve the src and calls a user callback,
 * allowing to transform the props, before optimizing the image according to
 * the transformed properties.
 */
export interface PictureProps extends Omit<ImageProps, 'format'> {
  widths?: number[];
  formats?: OutputFormat[];
  callback?: (props: CallbackProps) => void | Promise<void>;
}

/**
 * We guarantee, that src is resolved before any callback is called.
 */
export interface CallbackProps extends Omit<PictureProps, 'src' | 'callback'> {
  src: ImageMetadata;
}
