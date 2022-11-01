import { deepMerge, exists, toLinux, type ObjectLike } from '@internal/utils';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import YAML from 'js-yaml';
import { dirname, join, normalize } from 'path';

export async function mergeFrontmatter(
  name: string,
  dir: string,
  stop: string,
  resolvePaths: boolean
): Promise<ObjectLike | undefined> {
  if (!name) {
    throw new Error("'name' must be a valid filename");
  }
  if (!dir) {
    throw new Error("'dir' must be a valid directory name");
  }
  if (!stop) {
    throw new Error("'stop' must be a valid directory name");
  }
  dir = normalize(dir);
  stop = normalize(stop);
  if (!dir.startsWith(stop)) {
    throw new Error('dir must be a subdirectory of stop');
  }

  return _mergeFrontmatter(name, dir, stop, undefined, resolvePaths);
}

async function _mergeFrontmatter(
  name: string,
  dir: string,
  stop: string,
  previous: ObjectLike | undefined,
  resolvePaths: boolean
): Promise<ObjectLike | undefined> {
  const file = join(dir, name);
  if (await exists(file)) {
    const yaml = await readFile(file, 'utf8');
    const current = YAML.load(yaml) as ObjectLike;
    if (resolvePaths) {
      _resolvePaths(current, dir);
    }
    if (previous) {
      previous = deepMerge(current, previous);
    } else {
      previous = current;
    }
  }
  if (dir === stop) {
    return previous;
  }
  return await _mergeFrontmatter(name, dirname(dir), stop, previous, resolvePaths);
}

function _resolvePaths(frontmatter: object, base: string) {
  for (const [key, value] of Object.entries(frontmatter)) {
    if (value) {
      if (typeof value === 'object') {
        _resolvePaths(value, base);
      } else if (typeof value === 'string') {
        if (toLinux(value).startsWith('./') || toLinux(value).startsWith('../')) {
          const file = join(base, value);
          if (existsSync(file)) {
            (frontmatter as ObjectLike)[key] = toLinux(file);
          }
        }
      }
    }
  }
}
