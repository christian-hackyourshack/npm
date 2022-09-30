import type { Root } from 'mdast';
import { isAbsolute } from 'path';
import { createJsxElement, createProgram, findAllImages } from '../utils/mdx';

export async function relativeImages(root: Root) {
  const relativeImages = findAllImages(root).filter((f) => !isAbsolute(f[0].url));

  let imageCount = 0;
  await Promise.all(
    relativeImages.map(async ([image, parent]) => {
      const index = parent.children.indexOf(image);
      if (index < 0) {
        throw new Error(
          `relativeImages: image (${image.url} [${image.position?.start.line}:${image.position?.start.column}]) does not have a parent`
        );
      }
      const name = `relImg__${imageCount++}`;
      const src = `src={${name}}`;
      const alt = image.alt ? ` alt='${image.alt}'` : '';
      const title = image.title ? ` alt='${image.title}'` : '';
      const imageElement = createJsxElement(`<img ${src}${alt}${title} />`);
      parent.children[index] = imageElement;
      const imageImport = createProgram(`import ${name} from './${image.url}';`);
      root.children.push(imageImport);
    })
  );
}
