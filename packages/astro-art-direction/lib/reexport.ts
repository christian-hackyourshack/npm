import type { ColorDefinition, CropFit, CropPosition, OutputFormat, TransformOptions } from '@astrojs/image/dist/loaders';

export type { ImgHTMLAttributes } from '@astrojs/image/components';
export type { ImageMetadata } from '@astrojs/image/dist/vite-plugin-astro-image';
export type AspectRatio = TransformOptions['aspectRatio'];
export type Background = ColorDefinition;
export type Decoding = HTMLImageElement['decoding'];
export type Fit = CropFit;
export type Format = OutputFormat;
export type Loading = HTMLImageElement['loading'];
export type Position = CropPosition;
