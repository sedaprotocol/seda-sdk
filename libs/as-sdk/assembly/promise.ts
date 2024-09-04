import { JSON } from 'json-as/assembly';
import { jsonArrToUint8Array } from './json-utils';
import { toString } from './string-utils';

export interface FromBuffer<T> {
  fromBuffer(buffer: Uint8Array): T;
}

@json
class PromiseStatusResult {
  Fulfilled!: u8[] | null;
  Rejected!: u8[] | null;
}

export class PromiseStatus<F, R> {
  private constructor(private fulfilled: F | null, private rejected: R | null) {}

  static fromStr<F extends FromBuffer<F>, R extends FromBuffer<R>>(
    promiseStatus: string,
    fulfilled: F,
    rejected: R
  ): PromiseStatus<F, R> {
    const value = JSON.parse<PromiseStatusResult>(promiseStatus);
    let fulfilledResult: F | null = null;
    let rejectedResult: R | null = null;

    const rawFulfilled = value.Fulfilled;
    if (rawFulfilled && rawFulfilled.length > 0) {
      const bytes = jsonArrToUint8Array(rawFulfilled);
      fulfilledResult = fulfilled.fromBuffer(bytes);
    }

    const rawRejected = value.Rejected;
    if (rawRejected && rawRejected.length > 0) {
      const bytes = jsonArrToUint8Array(rawRejected);
      rejectedResult = rejected.fromBuffer(bytes);
    }

    return new PromiseStatus(fulfilledResult, rejectedResult);
  }

  isRejected(): bool {
    return this.rejected !== null;
  }

  isFulfilled(): bool {
    return this.fulfilled !== null;
  }

  unwrap(): F {
    const fulfilled = this.fulfilled;

    if (fulfilled === null) {
      throw new Error('Unwrapping a non fulfilled value');
    }

    return fulfilled;
  }

  unwrapRejected(): R {
    const rejected = this.rejected;

    if (rejected === null) {
      throw new Error('Unwrapping a non rejected value');
    }

    return rejected;
  }

  toString(): string {
    const display = new PromiseStatusDisplay();
  
    if (this.fulfilled !== null) {
      display.fulfilled = toString(this.fulfilled);
    }

    if (this.rejected !== null) {
      display.rejected = toString(this.rejected);
    }

    return JSON.stringify(display);
  }
}

@json
class PromiseStatusDisplay {
  type: string = "PromiseStatusDisplay"

  @omitnull()
  fulfilled: string | null = null;

  @omitnull()
  rejected: string | null = null;
}

