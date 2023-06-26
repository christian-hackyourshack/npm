/// <reference path="../.astro/types.d.ts" />
/// <reference types="@astrojs/image/client" />
// <reference types="astro/client" />

declare module '*.mdx' {
  export const title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const components: Record<string, any>;
}
