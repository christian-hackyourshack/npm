import { relative } from 'path';

const BETWEEN_BRACES = /\(([^)]+)\)/;

/**
 * Get caller location (file and line)
 *
 * @param e Error providing the call stack
 * @param start Function name to search in the stack
 * @param up number of levels up you want to get the call stack, default = 0, meaning, you will get the location of the found function
 * @returns the file and line of the caller
 */
export function getLocation(e: Error, start: string, up = 0) {
  const stack = e.stack?.split('\n') ?? [];
  const here = stack.findIndex((s) => s.includes(start));
  const caller = here >= 0 ? Math.min(stack.length - 1, here + 1 + up) : stack.length - 1;
  if (here >= 0 && stack.length > caller) {
    let location = stack[caller];
    const found = location.match(BETWEEN_BRACES);
    if (found) {
      location = found[1];
      const segments = location.split(':');
      const file = relative(process.cwd(), segments[0]);
      const line = segments[1] ?? 1;
      return { file, line };
    } else {
      return { file: location.trim(), line: 1 };
    }
  }
  return {
    file: stack.join(' '),
    line: -1,
  };
}
