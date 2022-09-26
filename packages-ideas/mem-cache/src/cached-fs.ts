import { constants } from 'fs';
import { access } from 'fs/promises';
import { dirname, join, normalize } from 'path';
import { MemCache } from './index';

const existsCache = new MemCache(async (name: string) => {
  if (!name) {
    throw new Error("'name' must be a valid filename");
  }
  try {
    await access(name, constants.F_OK);
    return true;
  } catch {
    return false;
  }
});

/**
 * Check if path exists
 * @param name path name
 * @returns true if path exists
 */
export async function exists(name: string): Promise<boolean> {
  return existsCache.get(name);
}

const findUpCache = new MemCache(
  /**
   * Recursively walk up the directory tree to find the file
   */
  async (
    name: string,
    dir: string,
    stop: string | undefined = undefined
  ): Promise<string | undefined> => {
    const file = join(dir, name);
    if (await exists(file)) {
      return file;
    } else if (dir !== stop) {
      return findUpCache.get(name, dirname(dir), stop);
    } else {
      return undefined;
    }
  }
);

/**
 * Find a file with given `name` in the directory `dir` or parent directories,
 * optionally stopping in directory `stop`.
 * @param name file to find
 * @param dir directory to start
 * @param stop (optional) directory to stop
 * @returns path of file, if found, `undefined` otherwise
 */
export async function findUp(
  name: string,
  dir: string,
  stop: string | undefined = undefined
): Promise<string | undefined> {
  if (!name) {
    throw new Error("'name' must be a valid filename");
  }
  if (!dir) {
    throw new Error("'dir' must be a valid directory name");
  }
  dir = normalize(dir);
  if (stop) {
    stop = normalize(stop);
    if (!dir.startsWith(stop)) {
      throw new Error('dir must be a subdirectory of stop');
    }
  }

  return findUpCache.get(name, dir, stop);
}

const findUpAllCache = new MemCache(
  /**
   * Recursively push all found files to the result array
   */
  async (name: string, dir: string, stop: string): Promise<string[]> => {
    const up =
      dir !== stop //
        ? await findUpAllCache.get(name, dirname(dir), stop)
        : [];
    const file = join(dir, name);
    if (await exists(file)) {
      return [...up, file];
    } else {
      return up;
    }
  }
);

/**
 * Find all files with given `name` in the directory `dir` or parent
 * directories, stopping in directory `stop`.
 *
 * The order is top-down
 *
 * @param name file to find
 * @param dir directory to start
 * @param stop directory to stop
 * @returns array of files from top to bottom, might be empty
 */
export async function findUpAll(name: string, dir: string, stop: string): Promise<string[]> {
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
  return findUpAllCache.get(name, dir, stop);
}
