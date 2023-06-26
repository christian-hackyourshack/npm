import type { TransformOptions } from '@astrojs/image/dist/loaders';
import type { ArtDirection } from "./ArtDirection";
import type { Format, ImageMetadata, ImgHTMLAttributes } from "./reexport";

/**
 * The Picture environment tries to resolve the src and calls art direction,
 * allowing to transform the props, before optimizing the image according to
 * the transformed properties.
 */
export interface PictureProps extends Omit<TransformOptions, 'alt' | 'src' | 'format'>, Omit<ImgHTMLAttributes, 'alt' | 'height' | 'slot' | 'src' | 'width'> {
  /** 
   * Defines an alternative text description of the image. Set to an empty 
   * string (alt="") if the image is not a key part of the content
   * (it's decoration or a tracking pixel).
   */
  alt: string;
  src: string | ImageMetadata | Promise<{ default: ImageMetadata }>;
  /**
   * The raw widths of the generated images.
   */
  widths?: number[];
  /**
   * The output formats to generate.
   */
  formats?: Format[];
  /**
   * Art direction allows to transform the props before optimizing the image.
   */
  artDirection?: Partial<ArtDirection>;
  /** 
   * Do not use explicitly!
   * This just reflects a property added by the remark MDX compiler
   */
  className?: string;
}
