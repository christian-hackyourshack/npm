export function isString(input: unknown): boolean {
  return typeof input === 'string';
}

export function isDefined(input: unknown): boolean {
  return input !== undefined && input !== null;
}

export function isNotEmpty(input: unknown): boolean {
  if (typeof input === 'string') return input.length > 0;
  if (Array.isArray(input)) return input.length > 0;
  if (typeof input === 'object') return Object.keys(input as object).length > 0;
  return false;
}
