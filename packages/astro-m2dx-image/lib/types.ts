import type { ImgHTMLAttributes } from '@astrojs/image/components';
import type { OutputFormat, TransformOptions } from '@astrojs/image/dist/loaders';
import type { ImageMetadata } from '@astrojs/image/dist/vite-plugin-astro-image';

export interface ImageProps
  extends Omit<TransformOptions, 'src'>,
    Omit<ImgHTMLAttributes, 'slot' | 'alt' | 'src' | 'width' | 'height'> {
  /** Defines an alternative text description of the image. Set to an empty string (alt="") if the image is not a key part of the content (it's decoration or a tracking pixel). */
  alt: string;
  src: string | ImageMetadata | Promise<{ default: ImageMetadata }>;
}

interface BasePictureProps extends ImageProps {
  sizes?: HTMLImageElement['sizes'];
  widths?: number[];
  formats?: OutputFormat[];
}

export interface CallbackProps extends Omit<BasePictureProps, 'src'> {
  src: string | ImageMetadata;
}

export interface PictureProps extends BasePictureProps {
  callback?: (props: CallbackProps) => void | Promise<void>;
}

export type { ImageMetadata };
