export class Result {
  readonly #errors: Error[] = [];

  constructor(public all = 0, public failed = 0, error?: Error) {
    if (error) {
      this.#errors.push(error);
    }
  }

  add(other: Result) {
    this.all += other.all;
    this.failed += other.failed;
    this.#errors.push(...other.errors);
  }

  get errors() {
    return [...this.#errors];
  }

  addError(e: Error) {
    return this.#errors.push(e);
  }

  get success() {
    return this.failed === 0 && this.#errors.length === 0;
  }
}

export function isResult(object: unknown): object is Result {
  return (
    !!object &&
    typeof object === 'object' &&
    Object.keys(object).includes('all') &&
    Object.keys(object).includes('failed')
  );
}
