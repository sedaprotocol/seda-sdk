import { JSON } from 'json-as/assembly';
import { jsonArrToUint8Array } from './json-utils';

export interface FromBuffer<T> {
  fromBuffer(buffer: Uint8Array): T;
}

@json
class PromiseStatusResult {
  Fulfilled!: u8[] | null;
  Rejected!: u8[] | null;
}

export class PromiseStatus<F, R> {
  private constructor(public fulfilled: F | null, public rejected: R | null) {}

  static fromStr<F extends FromBuffer<F>, R extends FromBuffer<R>>(
    promiseStatus: string,
    fulfilled: F,
    rejected: R
  ): PromiseStatus<F, R> {
    const value = JSON.parse<PromiseStatusResult>(promiseStatus);
    let fulfilledResult: F | null = null;
    let rejectedResult: R | null = null;

    const rawFulfilled = value.Fulfilled;
    if (rawFulfilled) {
      const bytes = jsonArrToUint8Array(rawFulfilled);
      fulfilledResult = fulfilled.fromBuffer(bytes);
    }

    const rawRejected = value.Rejected;
    if (rawRejected) {
      const bytes = jsonArrToUint8Array(rawRejected);
      rejectedResult = rejected.fromBuffer(bytes);
    }

    return new PromiseStatus(fulfilledResult, rejectedResult);
  }
}
