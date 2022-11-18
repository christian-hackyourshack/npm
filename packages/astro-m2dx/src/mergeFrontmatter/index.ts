import { deepMerge, exists, normalizeAll, type ObjectLike } from '@internal/utils';
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

  return _mergeFrontmatter(dir, name, dir, stop, undefined, resolvePaths);
}

async function _mergeFrontmatter(
  targetDir: string,
  name: string,
  dir: string,
  stop: string,
  previous: ObjectLike | undefined,
  resolvePaths: boolean
): Promise<ObjectLike | undefined> {
  const file = join(dir, name);
  if (await exists(file)) {
    const yaml = await readFile(file, 'utf8');
    let current = YAML.load(yaml) as ObjectLike;
    if (resolvePaths) {
      current = normalizeAll(current, dir, targetDir, true);
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
  return await _mergeFrontmatter(targetDir, name, dirname(dir), stop, previous, resolvePaths);
}
