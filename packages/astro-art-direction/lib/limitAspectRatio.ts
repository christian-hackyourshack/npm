import { getAspectRatio } from "./aspectRatio";
import type { AspectRatio, ImageMetadata } from "./reexport";

export function limitAspectRatio(limit: number) {
  return ({ aspectRatio, src }: {
    aspectRatio?: AspectRatio;
    src: ImageMetadata;
  }) => {
    aspectRatio = getAspectRatio({ aspectRatio, src });
    if (aspectRatio) {
      return Math.min(
        Math.max(1 / limit, aspectRatio),
        limit
      );
    }
    return undefined;
  };
}
