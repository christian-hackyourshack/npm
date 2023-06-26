export function classList(
  ...input: Array<string | null | undefined>
): string[] {
  if (!input) return [];

  const merged = new Set<string>();
  input.forEach((item) => {
    item?.split(/\s+/g).forEach((c) => !!c && merged.add(c));
  });
  return [...merged];
}
