import type { AspectRatio, ImageMetadata } from "./reexport";

/**
 * The function first attempts to parse the aspectRatio property of the props 
 * object using the parseAspectRatio function. If the aspectRatio property is 
 * not a valid number or string, the function attempts to compute the aspect 
 * ratio using the computeAspectRatio function with the width and height 
 * properties of the props object. If the width and height properties are not 
 * defined or are null, the function attempts to compute the aspect ratio using 
 * the computeAspectRatio function with the width and height properties of the 
 * src property of the props object. If the src property is not defined or is 
 * null, the function returns undefined.
 *
 * @param props of typical picture props with an optional resolved src attribute
 * @returns the aspect ratio of the given props object if it can be computed, otherwise it returns undefined.
 */
export function getAspectRatio(props: {
  src?: ImageMetadata;
  aspectRatio?: AspectRatio;
  width?: number | null;
  height?: number | null;
}): number | undefined {
  return (
    parseAspectRatio(props.aspectRatio) || //
    computeAspectRatio(props.width, props.height) ||
    computeAspectRatio(props.src?.width, props.src?.height)
  );
}

/**
 * @param aspectRatio 
 * @returns the aspect ratio as a number if the input is a number or a string in the format of "width:height". If the input is not a valid number or string, the function returns undefined.
 */
export function parseAspectRatio(aspectRatio?: AspectRatio): number | undefined {
  if (typeof aspectRatio === 'number') {
    return aspectRatio;
  } else if (typeof aspectRatio === 'string') {
    const [width, height] = aspectRatio.split(':');
    try {
      return parseInt(width) / parseInt(height);
    } catch (e) {
      console.error(`Invalid aspect ratio: ${aspectRatio}`);
    }
  }
  return undefined;
}

/**
 * @param width 
 * @param height 
 * @returns the aspect ratio of the given width and height if both parameters are not null or undefined. Returns undefined otherwise.
 */
export function computeAspectRatio(width?: number | null, height?: number | null) {
  if (width && height) {
    return width / height;
  }
  return undefined;
}

