export function fillDigits(n: number, d: number) {
  return n.toLocaleString(undefined, { minimumIntegerDigits: d });
}
