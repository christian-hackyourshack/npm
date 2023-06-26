import { readFile } from 'fs/promises';
import { join } from 'path';
import { VFile } from 'vfile';

export async function loadVFile(...paths: string[]): Promise<VFile> {
  const path = join(...paths);
  const value = await readFile(path, 'utf8');
  return new VFile({ path, value });
}
