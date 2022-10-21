export function fill(s: string, length: number, filler = ' ') {
  if (s.length >= length) return s;
  while (s.length < length) {
    s = s + filler;
  }
  return s;
}
