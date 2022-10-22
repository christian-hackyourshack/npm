import { readFile } from 'fs/promises';
import grayMatter from 'gray-matter';

export async function parseFrontmatter(file: string) {
  const code = await readFile(file, 'utf8');
  const { data } = grayMatter(code);
  return data;
}
