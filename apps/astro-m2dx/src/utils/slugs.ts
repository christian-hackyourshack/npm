const BLOG_SLUG = /\/([^/]+)\/index.mdx$/;
export function blogSlug(file: string) {
  return (file.match(BLOG_SLUG) ?? [undefined, undefined])[1];
}
