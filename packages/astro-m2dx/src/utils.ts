import path from 'path';

export function toLinux(...paths: string[]): string[] {
  if (path.sep === '\\') {
    return paths.map((p) => p.replaceAll('\\', '/'));
  } else {
    return paths;
  }
}
