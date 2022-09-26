import { readFile } from 'fs/promises';
import YAML from 'js-yaml';
import { dirname, join, normalize } from 'path';
import { deepMerge, type ObjectLike } from '../utils/deepMerge';
import { exists } from '../utils/fs';

async function _mergeFrontmatter(
  name: string,
  dir: string,
  stop: string,
  previous: ObjectLike | undefined
): Promise<ObjectLike | undefined> {
  const file = join(dir, name);
  if (await exists(file)) {
    const yaml = await readFile(file, 'utf8');
    const current = YAML.load(yaml) as ObjectLike;
    if (previous) {
      previous = deepMerge(current, previous);
    } else {
      previous = current;
    }
  }
  if (dir === stop) {
    return previous;
  }
  return await _mergeFrontmatter(name, dirname(dir), stop, previous);
}

export async function mergeFrontmatter(
  name: string,
  dir: string,
  stop: string
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

  return _mergeFrontmatter(name, dir, stop, undefined);
}
