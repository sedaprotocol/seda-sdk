import { toString } from "./string-utils";

/**
 * A Result type that represents either a success (Ok) or failure (Err) state.
 * This is useful for error handling and expressing outcomes that might fail.
 *
 * @example
 * ```ts
 * // Creating a successful result
 * const success = Result.ok<string>("data");
 *
 * // Creating a failed result
 * const failure = Result.err<string, Error>(new Error("error message"));
 *
 * // Safely handling both cases
 * if (success.isOk()) {
 *   const value = success.unwrap(); // "data"
 * }
 * ```
 *
 * @typeParam V - The type of the success value
 * @typeParam E - The type of the error value, defaults to Error
 */
export class Result<V, E = Error> {
	private okValue!: V;
	private constructor(private errValue: E | null) {}

	private setOkValue<OkValue extends V>(value: OkValue): void {
		this.okValue = value;
	}

	/**
	 * Extracts the error value from a Result if it's an Err variant.
	 *
	 * @throws {Error} If the Result is Ok variant
	 * @returns The error value
	 *
	 * @example
	 * ```ts
	 * const result = Result.err<number, string>("invalid input");
	 * const error = result.unwrapErr(); // returns "invalid input"
	 * ```
	 */
	unwrapErr(): E {
		const errorValue = this.errValue;

		if (errorValue === null) {
			throw new Error("Called unwrapErr on a non error Result");
		}

		return errorValue;
	}

	/**
	 * Returns the success value if Result is Ok, otherwise returns the provided default value.
	 * This is a safe way to get a value without throwing an error.
	 *
	 * @param orValue - The default value to return if Result is Err
	 * @returns Either the success value or the provided default
	 *
	 * @example
	 * ```ts
	 * const success = Result.ok<number, string>(42);
	 * const failure = Result.err<number, string>("error");
	 *
	 * success.unwrapOr(0); // returns 42
	 * failure.unwrapOr(0); // returns 0
	 * ```
	 */
	unwrapOr(orValue: V): V {
		if (this.isOk()) {
			return this.unwrap();
		}

		return orValue;
	}

	/**
	 * Extracts the success value from a Result if it's an Ok variant.
	 *
	 * @throws {Error} If the Result is Err variant
	 * @returns The success value
	 *
	 * @example
	 * ```ts
	 * const result = Result.ok<number, string>(42);
	 * const value = result.unwrap(); // returns 42
	 * ```
	 */
	unwrap(): V {
		const okValue = this.okValue;

		if (this.isErr()) {
			throw new Error("Called unwrap on a non ok Result");
		}

		return okValue;
	}

	/**
	 * Checks if the Result is Ok variant.
	 *
	 * @returns true if Result is Ok, false otherwise
	 *
	 * @example
	 * ```ts
	 * const success = Result.ok<number, string>(42);
	 * if (success.isOk()) {
	 *   // Safe to unwrap
	 *   const value = success.unwrap();
	 * }
	 * ```
	 */
	isOk(): bool {
		return !this.isErr();
	}

	/**
	 * Checks if the Result is Err variant.
	 *
	 * @returns true if Result is Err, false otherwise
	 *
	 * @example
	 * ```ts
	 * const failure = Result.err<number, string>("error");
	 * if (failure.isErr()) {
	 *   // Safe to unwrapErr
	 *   const error = failure.unwrapErr();
	 * }
	 * ```
	 */
	isErr(): bool {
		const errValue = this.errValue;
		return errValue !== null;
	}

	/**
	 * Creates a new Result in the Ok state with the given value.
	 *
	 * @param value - The success value
	 * @returns A new Result instance containing the success value
	 *
	 * @example
	 * ```ts
	 * const success = Result.ok<number, string>(42);
	 * ```
	 */
	static ok<OkValue, ErrValue = Error>(
		value: OkValue,
	): Result<OkValue, ErrValue> {
		const result = new Result<OkValue, ErrValue>(null);
		result.setOkValue(value);
		return result;
	}

	/**
	 * Creates a new Result in the Err state with the given error.
	 *
	 * @param err - The error value
	 * @returns A new Result instance containing the error value
	 *
	 * @example
	 * ```ts
	 * const failure = Result.err<number, string>("invalid input");
	 * ```
	 */
	static err<OkValue, ErrValue = Error>(
		err: ErrValue,
	): Result<OkValue, ErrValue> {
		return new Result<OkValue, ErrValue>(err);
	}

	toString(): string {
		if (this.isErr()) {
			return `Err<${toString(this.unwrapErr())}>`;
		}

		return `Ok<${toString(this.unwrap())}>`;
	}
}
