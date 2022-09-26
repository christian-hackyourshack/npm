/**
 * In-memory cache for stateless functions
 */
export class MemCache<P extends unknown[], V> {
  readonly cache: Record<string, V> = {};
  readonly undefinedKeys: Set<string> = new Set();

  constructor(private server: (...p: P) => V) {}

  #getKey(p: P): string {
    return JSON.stringify(p);
  }

  get(...p: P): V {
    const key = this.#getKey(p);
    let value = this.cache[key];
    if (value !== undefined || this.undefinedKeys.has(key)) {
      return value;
    }
    value = this.server(...p);
    if (value === undefined) {
      this.undefinedKeys.add(key);
    } else {
      this.cache[key] = value;
    }
    return value;
  }
}
