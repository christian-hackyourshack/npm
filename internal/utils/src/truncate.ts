export function truncate(s: string, length: number, ellipsis = false) {
  return s.length > length
    ? s.substring(0, ellipsis ? length - 3 : length) + ellipsis
      ? '...'
      : ''
    : s;
}
