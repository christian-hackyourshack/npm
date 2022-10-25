import { exists, isObjectLike } from '@internal/utils';
import type { Identifier, VariableDeclarator } from 'estree';
import { readFile } from 'fs/promises';
import {
  createJsxElement,
  createProgram,
  findAllImages,
  isIdentifier,
  isMdxJsxAttribute,
  isMdxJsxFlowElement,
  isObjectExpression,
  isProperty,
  parseEsm,
  visit,
} from 'm2dx-utils';
import type { Root } from 'mdast';
import type { MdxJsxAttribute, MdxJsxAttributeValueExpression } from 'mdast-util-mdx';
import path, { isAbsolute, join } from 'path';
import { findExportInMdx, findExportInProgram } from '../exportComponents/findExportInMdx';

export async function relativeImages(root: Root, baseDir: string, files?: string[]) {
  let imageCount = 0;
  const relativeImages = findAllImages(root).filter((f) => !isAbsolute(f[0].url));
  let imageComponent;
  if (relativeImages.length > 0) {
    imageComponent = (await findImageComponent(root, files)) ?? 'img';
  }
  for (const [image, parent] of relativeImages) {
    const path = join(baseDir, image.url);
    if (await exists(path)) {
      const name = `relImg__${imageCount++}`;

      const src = `src={${name}}`;
      const alt = image.alt ? ` alt="${image.alt}"` : '';
      const title = image.title ? ` title="${image.title}"` : '';
      const attributes = hPropertiesToAttributes(image.data?.hProperties);
      const index = parent.children.indexOf(image);
      if (index < 0) {
        throw new Error(
          `relativeImages: image (${image.url} [${image.position?.start.line}:${image.position?.start.column}]) does not have a parent`
        );
      }
      parent.children[index] = createJsxElement(
        `<${imageComponent} ${src}${alt}${title}${attributes} />`
      );
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

async function findImageComponent(root: Root, files?: string[]): Promise<string | undefined> {
  let fileIndex = files ? files.length - 1 : -1;
  let found = findExportInMdx(root);
  while (found || fileIndex >= 0) {
    const init = found?.init;
    if (isObjectExpression(init)) {
      const imgProperty = init.properties
        .filter(isProperty)
        .find((p) => (p.key as Identifier)?.name === 'img');
      if (imgProperty && isIdentifier(imgProperty.value)) {
        return imgProperty.value.name;
      }
    }
    found = undefined;
    while (fileIndex >= 0 && !found) {
      found = await findExportInFile(files![fileIndex]);
      fileIndex--;
    }
  }
  return undefined;
}

async function findExportInFile(file: string): Promise<VariableDeclarator | undefined> {
  const src = await readFile(file, 'utf8');
  const program = parseEsm(src);
  return findExportInProgram(program);
}

function hPropertiesToAttributes(properties: unknown): string {
  if (!isObjectLike(properties)) {
    return '';
  }

  return (
    ' ' +
    Object.keys(properties)
      .map((k) => `${k}="${properties[k]}"`)
      .join(' ')
  );
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
