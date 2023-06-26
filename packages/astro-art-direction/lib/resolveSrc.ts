import type { InputFormat } from '@astrojs/image/dist/loaders';
import { metadata } from '@astrojs/image/dist/utils/metadata';
import { existsSync } from 'fs';
import { extname, normalize, relative } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import type { ImageMetadata } from './reexport';

export async function resolveSrc(
  src: string | ImageMetadata | Promise<{ default: ImageMetadata }>
): Promise<ImageMetadata> {
  if (typeof src === 'string') {
    if (src.startsWith('file://')) {
      src = fileURLToPath(src);
    }
    src = normalize(src);
    if (existsSync(src)) {
      const url = pathToFileURL(src)
      const data = await metadata(url);
      if (data) {
        data.src = './' + relative(process.cwd(), data.src);
        return data;
      }
    }
    // TODO: optionally download remote image
    return {
      src,
      width: 0,
      height: 0,
      format: extname(src).replace('.', '') as InputFormat,
    };
  } else if ('then' in src) {
    return (await src).default;
  }
  return src as ImageMetadata;
}
