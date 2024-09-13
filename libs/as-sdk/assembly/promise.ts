import { JSON } from "json-as/assembly";
import { jsonArrToUint8Array } from "./json-utils";

export interface FromBuffer<T> {
	fromBuffer(buffer: Uint8Array): T;
}

@json
class PromiseStatusResult {
	Fulfilled!: u8[] | null;
	Rejected!: u8[] | null;
}

/**
 * A class which represents the outcome of an action which can either succeed or fail.
 * See {@linkcode httpFetch} for an example on how it can be used.
 */
@json
export class PromiseStatus<F, R> {
	/** @hidden */
	private constructor(
		/** @hidden */
		private fulfilled: F | null,
		/** @hidden */
		private rejected: R | null,
	) {}

	/** @hidden */
	static fromStr<F extends FromBuffer<F>, R extends FromBuffer<R>>(
		promiseStatus: string,
		fulfilled: F,
		rejected: R,
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

	/**
	 * Check whether this promise is rejected. When true use {@linkcode unwrapRejected} to access
	 * the rejected class.
	 */
	isRejected(): bool {
		return this.rejected !== null;
	}

	/**
	 * Check whether this promise is fulfilled. When true use {@linkcode unwrap} to access
	 * the fulfilled class.
	 */
	isFulfilled(): bool {
		return this.fulfilled !== null;
	}

	/**
	 * Access the fulfilled data serialised into the class set as the fulfilled class. Check {@linkcode isFulfilled}
	 * before calling this method.
	 * @throws when unwrapping a rejected Promise
	 */
	unwrap(): F {
		const fulfilled = this.fulfilled;

		if (fulfilled === null) {
			throw new Error("Unwrapping a non fulfilled value");
		}

		return fulfilled;
	}
	/**
	 * Access the rejected data serialised into the class set as the rejected class. Check {@linkcode isRejected}
	 * before calling this method.
	 * @throws when unwrapping a fulfilled Promise
	 */
	unwrapRejected(): R {
		const rejected = this.rejected;

		if (rejected === null) {
			throw new Error("Unwrapping a non rejected value");
		}

		return rejected;
	}
}
