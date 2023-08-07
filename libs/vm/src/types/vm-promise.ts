interface PromiseStatusResult {
  /** Actually a Uint8[] */
  Fulfilled?: number[];
  /** Actually a Uint8[] */
  Rejected?: number[];
}

export interface ToBuffer {
  toBuffer(): Uint8Array;
}

export class PromiseStatus<T> {
  private constructor(private value: PromiseStatusResult) {}

  static rejected<T extends ToBuffer>(value: T): PromiseStatus<T> {
    return new PromiseStatus({
      Rejected: Array.from(value.toBuffer()),
    });
  }

  static fulfilled<T extends ToBuffer>(value?: T): PromiseStatus<T> {
    return new PromiseStatus({
      Fulfilled: Array.from(value?.toBuffer() ?? []),
    });
  }

  get length() {
    return this.toJSON().length;
  }

  toJSON(): string {
    return JSON.stringify(this.value);
  }

  toBuffer(): Uint8Array {
    return new TextEncoder().encode(this.toJSON());
  }
}
