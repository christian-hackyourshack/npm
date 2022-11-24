import type { ImgHTMLAttributes } from '@astrojs/image/components';
import type { OutputFormat, TransformOptions } from '@astrojs/image/dist/loaders';
import type { ImageMetadata } from '@astrojs/image/dist/vite-plugin-astro-image';

type AspectRatio = TransformOptions['aspectRatio'];

interface ImageProps
  extends Omit<TransformOptions, 'src'>,
    Omit<ImgHTMLAttributes, 'slot' | 'alt' | 'src' | 'width' | 'height'> {
  /** Defines an alternative text description of the image. Set to an empty string (alt="") if the image is not a key part of the content (it's decoration or a tracking pixel). */
  alt: string;
  src: string | ImageMetadata | Promise<{ default: ImageMetadata }>;
}

interface BasePictureProps extends Omit<ImageProps, 'format'> {
  widths?: number[];
  formats?: OutputFormat[];
}

interface CallbackProps extends Omit<BasePictureProps, 'src'> {
  src: string | ImageMetadata;
}

interface PictureProps extends BasePictureProps {
  callback?: (props: CallbackProps) => void | Promise<void>;
}

export type {
  //
  AspectRatio,
  CallbackProps,
  ImageMetadata,
  ImageProps,
  PictureProps,
};
