import type { ArtDirection, ArtDirectionParams } from "./ArtDirection";
import { limitWidths } from "./limitWidths";

export const defaultArtDirection: ArtDirection = {
  after: () => undefined,
  before: () => undefined,
  getHeight: () => undefined,
  getAspectRatio: () => undefined,
  getMaxWidth: () => undefined,
  getLoading: () => undefined,
  getPosition: () => undefined,
  getFit: () => undefined,
  getFormats: () => ['avif', 'webp', 'jpeg'],
  getSizes,
  getWidths
};

function getWidths({ width, src }: ArtDirectionParams): number[] | undefined {
  if (width) {
    // We will cater only for pixel densities
    const pixelDensities = [1, 1.5, 2, 3];
    const widths = pixelDensities
      .map((pd) => Math.round(pd * width));
    return limitWidths(widths, src.width);
  }

  // We need to cater full width image
  // Default image widths, for full-width images in some default screen resolutions and their density factors
  return limitWidths([121, 376, 769, 1025, 1201, 2401, 4801], src.width);
}

function getSizes({ width }: ArtDirectionParams): string | undefined {
  if (width) return `(min-width: ${width}px) ${width}px, 100vw`;
  return undefined;
}
