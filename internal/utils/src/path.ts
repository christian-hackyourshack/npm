import { existsSync } from 'fs';
import { isAbsolute, join, relative } from 'path';
import { isObjectLike, ObjectLike } from './ObjectLike';

export function toLinux(file: string): string {
  return file.replaceAll('\\', '/');
}

/**
 * Normalize a relative path-like string.
 *
 * We consider strings that start with `./` and `../` to be path-like,
 * all other strings will be returned unchanged, except you confirm, that the
 * src is a path, then we just use path.isAbsolute() to determine whether the
 * src is relative.
 *
 * @param src path-like string
 * @param base base to resolve relative paths
 * @param newbase make resulting path relative to this base
 * @param isPath confirm that src is a path
 * @returns path-like string in Linux format
 */
export function normalizeRelative(
  src: string,
  base?: string,
  newbase?: string,
  isPath = false,
  checkExistence = false
): string {
  let newsrc = toLinux(src);
  if ((isPath && !isAbsolute(src)) || newsrc.startsWith('./') || newsrc.startsWith('../')) {
    newsrc = join(base ?? process.cwd(), newsrc);
    if (newbase) {
      newsrc = relative(newbase, newsrc);
    }
    if (
      !isPath &&
      !newsrc.startsWith('/') &&
      !newsrc.startsWith('./') &&
      !newsrc.startsWith('../')
    ) {
      newsrc = './' + newsrc;
    }
    newsrc = toLinux(newsrc);
    if (newsrc !== src && checkExistence && !existsSync(newbase ? join(newbase, newsrc) : newsrc)) {
      return src;
    }
    return newsrc;
  }
  return src;
}

export function normalizeAll<T>(
  src: T,
  base?: string,
  newbase?: string,
  checkExistence = false
): T {
  if (typeof src === 'string') {
    return normalizeRelative(src, base, newbase, false, true) as T;
  } else if (Array.isArray(src)) {
    let changed = false;
    const newsrc = [];
    for (const value of src) {
      const newvalue = normalizeAll(value, base, newbase, checkExistence);
      newsrc.push(newvalue);
      if (newvalue !== value) {
        changed = true;
      }
    }
    return changed ? (newsrc as T) : src;
  } else if (isObjectLike(src)) {
    let changed = false;
    const newsrc = {} as ObjectLike;
    for (const [key, value] of Object.entries(src as ObjectLike)) {
      const newvalue = normalizeAll(value, base, newbase, checkExistence);
      newsrc[key] = newvalue;
      if (newvalue !== value) {
        changed = true;
      }
    }
    return changed ? (newsrc as T) : src;
  }
  return src;
}
