import type { PictureProps } from './PictureProps';
import type {
  AspectRatio,
  Fit,
  ImageMetadata,
  Loading,
  Format,
  Position
} from './reexport';

/**
 * ArtDirection is a collection of functions to compute attributes, that are 
 * used in the generation of optimized images for the Picture component.
 */
export interface ArtDirection {
  /**
   * `after` is called after all other art direction functions have been 
   * applied. This function may change properties of the ArtDirectionParams.
   * @param params 
   */
  after: (params: ArtDirectionParams) => void;

  /**
   * `before` is called before all other art direction functions are applied. 
   * This function may change properties of the ArtDirectionParams.
   * @param params 
   */
  before: (params: ArtDirectionParams) => void;

  /** @returns the aspect ratio to be used for the image */
  getAspectRatio: (params:
    Omit<ArtDirectionParams, 'aspectRatio'> &
    { aspectRatio: AspectRatio | undefined })
    => number | undefined;

  /** @returns the crop fit to be used for the image */
  getFit: (params: ArtDirectionParams) => Fit | undefined;
  /** @returns the formats to be used for the srcsets */
  getFormats: (params: ArtDirectionParams) => Format[] | undefined;
  /** @returns the height to be used for the image */
  getHeight: (params: ArtDirectionParams) => number | undefined;
  /** @returns the loading to be used for the image */
  getLoading: (params: ArtDirectionParams) => Loading | undefined;
  /** @returns the maxWidth to be used for the image */
  getMaxWidth: (params: ArtDirectionParams) => number | undefined;
  /** @returns the crop position to be used for the image */
  getPosition: (params: ArtDirectionParams) => Position | undefined;
  /** @returns the sizes to be used for the sources elements */
  getSizes: (params: ArtDirectionParams) => string | undefined;
  /** @returns the widths to be used for the optimized images */
  getWidths: (params: ArtDirectionParams) => number[] | undefined;
}

/**
 * Input for the art direction functions. It contains all information from the PictureProps, additionally
 * 
 * - `src` is guaranteed to be resolved.
 * - `aspectRatio` is guaranteed to be a number, if it is defined.
 * - `classes` contains a unique list of all CSS classes from the props in 
 *    order of appearance.
 */
export interface ArtDirectionParams
  extends Omit<PictureProps, 'aspectRatio' | 'src'> //
{
  classes: string[];
  src: ImageMetadata;
  aspectRatio?: number;
}
