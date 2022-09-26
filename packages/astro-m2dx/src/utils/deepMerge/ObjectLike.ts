export type ObjectLike = Record<string, unknown>;

/**
 * Type guard for real objects (map like structures, no arrays, no dates)
 *
 * @param object
 * @returns if object is an Object, but not an Array and not a Date
 */
export function isObjectLike(object: unknown): object is ObjectLike {
  return (
    !!object && typeof object === 'object' && !Array.isArray(object) && !(object instanceof Date)
  );
}
