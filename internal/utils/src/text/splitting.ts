export function lastSegment(input: string, sep = '/'): string {
  const index = input.lastIndexOf(sep);
  return input.slice(index + 1);
}
