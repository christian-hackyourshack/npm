import { exists } from '@internal/utils';
import {
  createJsxElement,
  createProgram,
  findAllImages,
  isMdxJsxAttribute,
  isMdxJsxFlowElement,
  visit,
} from 'm2dx-utils';
import type { Root } from 'mdast';
import type { MdxJsxAttribute, MdxJsxAttributeValueExpression } from 'mdast-util-mdx';
import path, { isAbsolute, join } from 'path';

export async function relativeImages(root: Root, baseDir: string) {
  let imageCount = 0;

  const relativeImages = findAllImages(root).filter((f) => !isAbsolute(f[0].url));
  for (const [image, parent] of relativeImages) {
    const path = join(baseDir, image.url);
    if (await exists(path)) {
      const name = `relImg__${imageCount++}`;

      const src = `src={${name}}`;
      const alt = image.alt ? ` alt='${image.alt}'` : '';
      const title = image.title ? ` alt='${image.title}'` : '';
      const index = parent.children.indexOf(image);
      if (index < 0) {
        throw new Error(
          `relativeImages: image (${image.url} [${image.position?.start.line}:${image.position?.start.column}]) does not have a parent`
        );
      }
      parent.children[index] = createJsxElement(`<img ${src}${alt}${title} />`);
      const imageImport = createProgram(`import ${name} from '${path}';`);
      root.children.push(imageImport);
    }
  }

  const relativeJsxImages = findAllRelativeJsxImageReferences(root);
  for (const attribute of relativeJsxImages) {
    const path = join(baseDir, attribute.value as string);
    if (await exists(path)) {
      const name = `relImg__${imageCount++}`;
      attribute.value = toAttributeValueExpressionStatement(name);
      const imageImport = createProgram(`import ${name} from '${path}';`);
      root.children.push(imageImport);
    }
  }
}

const imageExtensions = ['.jpg', '.jpeg', '.png', '.svg', '.webp', '.gif', '.tiff', '.avif'];
function findAllRelativeJsxImageReferences(root: Root): MdxJsxAttribute[] {
  const result: MdxJsxAttribute[] = [];
  visit(root, isMdxJsxFlowElement, (node) => {
    for (const attribute of node.attributes.filter(isMdxJsxAttribute)) {
      const value = attribute.value;
      if (typeof value === 'string' && (value.startsWith('./') || value.startsWith('../'))) {
        if (imageExtensions.includes(path.extname(value))) {
          result.push(attribute);
        }
      }
    }
  });

  return result;
}

function toAttributeValueExpressionStatement(value: string): MdxJsxAttributeValueExpression {
  return {
    type: 'mdxJsxAttributeValueExpression',
    value,
    data: {
      estree: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Identifier',
              name: value,
            },
          },
        ],
        sourceType: 'module',
      },
    },
  };
}
