import { exists, isObjectLike, shortHash, toLinux } from '@internal/utils';
import type { Identifier, VariableDeclarator } from 'estree';
import { readFile } from 'fs/promises';
import {
  createJsxElement,
  createProgram,
  isIdentifier,
  isImage,
  isMdxJsxAttribute,
  isMdxJsxFlowElement,
  isObjectExpression,
  isProperty,
  parseEsm,
  visit,
} from 'm2dx-utils';
import type { Image, Parent, Root } from 'mdast';
import type { MdxjsEsm, MdxJsxAttribute, MdxJsxAttributeValueExpression } from 'mdast-util-mdx';
import path, { isAbsolute, join } from 'path';
import { findExportInMdx, findExportInProgram } from '../exportComponents/findExportInMdx';

export async function relativeImages(root: Root, baseDir: string, files?: string[]) {
  const relativeImages: [Image, Parent][] = [];
  visit(root, isImage, (node, parent) => {
    if (!isAbsolute(node.url)) {
      relativeImages.push([node as Image, parent as Parent]);
    }
  });

  let imageComponent: { name: string; requiredImport?: MdxjsEsm } = { name: 'img' };
  if (relativeImages.length > 0) {
    imageComponent = (await findImageComponent(root, files)) ?? imageComponent;
    if (imageComponent.requiredImport) {
      root.children.push(imageComponent.requiredImport);
    }
  }
  let imageCount = 0;
  for (const [image, parent] of relativeImages) {
    const path = join(baseDir, image.url);
    if (await exists(path)) {
      const index = parent.children.indexOf(image);
      if (index < 0) {
        throw new Error(
          `relativeImages: image (${image.url} [${image.position?.start.line}:${image.position?.start.column}]) does not have a parent`
        );
      }
      const name = `relImg__${imageCount++}`;
      const src = `src={${name}}`;
      const alt = image.alt ? ` alt="${image.alt}"` : '';
      const title = image.title ? ` title="${image.title}"` : '';
      const attributes = hPropertiesToAttributes(image.data?.hProperties);
      parent.children[index] = createJsxElement(
        `<${imageComponent.name} ${src}${alt}${title}${attributes} />`
      );
      const imageImport = createProgram(`import ${name} from '${toLinux(path)}';`);
      root.children.push(imageImport);
    }
  }

  const relativeJsxImages = findAllRelativeJsxImageReferences(root);
  for (const attribute of relativeJsxImages) {
    const path = join(baseDir, attribute.value as string);
    if (await exists(path)) {
      const name = `relImg__${imageCount++}`;
      attribute.value = toAttributeValueExpressionStatement(name);
      const imageImport = createProgram(`import ${name} from '${toLinux(path)}';`);
      root.children.push(imageImport);
    }
  }
}

async function findImageComponent(
  root: Root,
  files?: string[]
): Promise<{ name: string; requiredImport?: MdxjsEsm } | undefined> {
  let img = findImgProperty(findExportInMdx(root));
  if (img) {
    return { name: img };
  } else if (files && files.length > 0) {
    files = [...files].reverse();
    for (const file of files) {
      img = findImgProperty(await findExportInFile(file));
      if (img) {
        const alias = `_ic__${shortHash(file)}`;
        return {
          name: `${alias}.img`,
          requiredImport: createProgram(
            `import { components as ${alias} } from '${toLinux(file)}';`
          ),
        };
      }
    }
  }
  return undefined;
}

function findImgProperty(decl?: VariableDeclarator): string | undefined {
  const init = decl?.init;
  if (isObjectExpression(init)) {
    const imgProperty = init.properties
      .filter(isProperty)
      .find((p) => (p.key as Identifier)?.name === 'img');
    if (imgProperty && isIdentifier(imgProperty.value)) {
      return imgProperty.value.name;
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
