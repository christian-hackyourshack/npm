import type { ArtDirection, ArtDirectionParams } from "./ArtDirection";
import type { PictureProps } from "./PictureProps";
import { computeAspectRatio, parseAspectRatio } from "./aspectRatio";
import { classList } from "./classList";
import { defaultArtDirection } from "./defaultArtDirection";
import type { Format } from "./reexport";
import { resolveSrc } from "./resolveSrc";

/**
 * PictureProps after applying art direction.
 * 
 * It guarantees that the widths and formats properties are defined, as these 
 * are required for image optimization.
 */
export interface ADPictureProps extends Omit<PictureProps, 'widths' | 'formats'> {
  widths: number[];
  formats: Format[];
}

/**
 * Applies art direction to the given props.
 *
 * @param props The props to apply art direction to.
 * @returns The props after applying art direction.
 */
export async function applyArtDirection(props: PictureProps):
  Promise<ADPictureProps> //
{
  const ad: ArtDirection = {
    ...defaultArtDirection,
    ...props.artDirection,
  };

  const src = await resolveSrc(props.src)

  /**
   * MDX-JS fixes 'class' properties to be JSX-friendly 'className'. In Astro,
   * we expect it to be 'class' property, so this function reverts that fix.
   *
   * See https://github.com/mdx-js/mdx/blob/73a1aa6475e449058116e925bebf51f2931392a7/packages/mdx/mdx-hast-to-jsx.js#L49.
   * This used to be where it is done, after some refactorings, I cannot find
   * it anymore, but obviously it is still done somewhere in the MDX compiler.
   */
  const { class: astroClasses, className: mdxClasses } = props;

  const params: ArtDirectionParams = {
    ...props,
    classes: classList(astroClasses, mdxClasses),
    aspectRatio: parseAspectRatio(props.aspectRatio),
    src
  };
  ad.before(params);

  params.height ??= ad.getHeight(params);

  params.aspectRatio ??= computeAspectRatio(params.width, params.height);
  params.aspectRatio ??= ad.getAspectRatio({
    ...params,
    aspectRatio: props.aspectRatio
  });
  params.aspectRatio ??= computeAspectRatio(src.width, src.height);
  params.aspectRatio ??= getFallbackAspectRatio(src.src, params.alt);

  params.width ??= getProportionalWidth(params.aspectRatio, params.height);
  params.width ??= ad.getMaxWidth(params);
  params.width ??= src.width;

  params.widths ??= ad.getWidths(params);
  params.widths ??= getFallbackWidths(src.src, params.alt);

  params.sizes ??= ad.getSizes(params);

  params.loading ??= ad.getLoading(params);
  params.loading ??= params.classes?.includes('eager') ? 'eager' : undefined;

  params.position ??= ad.getPosition(params);

  params.fit ??= ad.getFit(params);

  params.formats ??= ad.getFormats(params);
  params.formats ??= getFallbackFormats(src.src, params.alt);

  ad.after(params);

  const className = params.classes.join(' ');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (params as any).classes;

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(params as any),
    class: className,
    // For now, unresolve src, if it could not be resolved
    src: !src.width ? src.src : src,
  } as ADPictureProps;
}

/**
 * @param aspectRatio 
 * @param height 
 * @returns a width that is proportional to the given height, using the given aspect ratio. Returns undefined if either aspect ratio or height is undefined.
 */
function getProportionalWidth(aspectRatio?: number, height?: number): number | undefined {
  if (aspectRatio && height) {
    return Math.round(aspectRatio * height);
  }
  return undefined;
}

/**
 * Output a warning that widths were not provided, and return a random default 
 * value.
 *
 * @param src
 * @param alt
 * @returns a random default value for widths.
 */
function getFallbackAspectRatio(src: string, alt?: string): number {
  const fallback = 1;
  console.warn(`
[astro-art-direction] No aspectRatio could be found for image. Because the aspectRatio is required to optimize images, we will use a random default value of "${fallback}", which is possibly not what you want.
<Picture src="${src}" alt="${alt}" ... />
`
  );
  return fallback;
}

/**
 * Output a warning that widths were not provided, and return a random default 
 * value.
 *
 * @param src
 * @param alt
 * @returns a random default value for widths.
 */
function getFallbackWidths(src: string, alt?: string): number[] {
  const fallback = [480];
  console.warn(`
[astro-art-direction] Your art direction explicitly provided no "widths" (overriding the default art direction). Because widths are required to optimize images, we will use a random default value of "${fallback}", which is possibly not what you want.
<Picture src="${src}" alt="${alt}" ... />
`
  );
  return fallback;
}

/**
 * Output a warning that formats were not provided, and return a random default
 * value.
 *
 * @param src
 * @param alt
 * @returns a random default value for formats.
 */
function getFallbackFormats(src: string, alt?: string): Format[] {
  const fallback: Format[] = ['jpeg'];
  console.warn(`
[astro-art-direction] Your art direction explicitly provided no "formats" (overriding the default art direction). Because formats are required to optimize images, we will use a random default value of "${fallback}", which is possibly not what you want.
<Picture src="${src}" alt="${alt}" ... />
`
  );
  return fallback;
}
