import { getPicture as _getPicture } from '@astrojs/image';
import { applyArtDirection } from './applyArtDirection';
import type { PictureProps } from './PictureProps';

export interface GetPictureResult {
  image: astroHTML.JSX.ImgHTMLAttributes;
  sources: {
    type: string;
    srcset: string;
    sizes?: string;
  }[];
}

export async function getPicture(props: PictureProps): Promise<GetPictureResult> {
  const adProps = await applyArtDirection(props);
  let { image, sources } = await _getPicture(adProps);
  sources = sources.map(({ type, srcset }) => ({
    type,
    srcset,
    sizes: adProps.sizes || undefined,
  }));

  image = {
    decoding: 'async',
    loading: adProps.loading || 'lazy',
    ...adProps,
    ...image,
    src: image.src,
  };

  // We need to clean up some of the props before passing them to the <img> tag
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cleanImage = image as any;
  delete cleanImage.artDirection;
  delete cleanImage.aspectRatio;
  delete cleanImage.background;
  delete cleanImage.fit;
  delete cleanImage.formats;
  delete cleanImage.position;
  delete cleanImage.sizes;
  delete cleanImage.widths;
  // delete cleanImage.height;
  // delete cleanImage.width;

  return { image, sources };
}
