import { toString } from "./string-utils";

/**
 * The Maybe class represents an optional value: every Maybe is either Just and contains a value,
 * or Nothing, and contains no value. This is a safer alternative to using null or undefined.
 *
 * @example
 * ```ts
 * // Creating a Maybe with a value
 * const justNumber = Maybe.just(42);
 *
 * // Creating a Maybe with no value
 * const noValue = Maybe.nothing<string>();
 * ```
 */
export class Maybe<V> {
	private value!: V;
	private constructor(private isValueOk: bool) {}

	private setValue<JustValue extends V>(value: JustValue): void {
		this.value = value;
	}

	/**
	 * Extracts the value from the Maybe if it exists.
	 * Throws an error if the Maybe contains Nothing.
	 *
	 * @example
	 * ```ts
	 * const maybe = Maybe.just(42);
	 * const value = maybe.unwrap(); // Returns 42
	 *
	 * const nothing = Maybe.nothing<number>();
	 * nothing.unwrap(); // Throws Error: "Called unwraped on a Nothing value"
	 * ```
	 *
	 * @throws {Error} If the Maybe contains Nothing
	 * @returns The contained value
	 */
	unwrap(): V {
		const value = this.value;

		if (!this.isValueOk) {
			throw new Error("Called unwraped on a Nothing value");
		}

		return value;
	}

	/**
	 * Returns the contained value or a provided default value if the Maybe is Nothing.
	 *
	 * @example
	 * ```ts
	 * const maybe = Maybe.just(42);
	 * const value1 = maybe.unwrapOr(0); // Returns 42
	 *
	 * const nothing = Maybe.nothing<number>();
	 * const value2 = nothing.unwrapOr(0); // Returns 0
	 * ```
	 *
	 * @param orValue The default value to return if Maybe is Nothing
	 * @returns The contained value or the default value
	 */
	unwrapOr(orValue: V): V {
		if (this.isJust()) {
			return this.unwrap();
		}

		return orValue;
	}

	/**
	 * Returns true if the Maybe contains a value (is Just).
	 *
	 * @example
	 * ```ts
	 * const maybe = Maybe.just("hello");
	 * if (maybe.isJust()) {
	 *     // Safe to unwrap
	 *     console.log(maybe.unwrap()); // Prints "hello"
	 * }
	 * ```
	 *
	 * @returns {bool} True if Maybe contains a value, false otherwise
	 */
	isJust(): bool {
		return !this.isNothing();
	}

	/**
	 * Returns true if the Maybe contains no value (is Nothing).
	 *
	 * @example
	 * ```ts
	 * const maybe = Maybe.nothing<string>();
	 * if (maybe.isNothing()) {
	 *     // Handle empty case
	 *     console.log("No value present");
	 * }
	 * ```
	 *
	 * @returns {bool} True if Maybe contains no value, false otherwise
	 */
	isNothing(): bool {
		return !this.isValueOk;
	}

	/**
	 * Creates a new Maybe with no value (Nothing).
	 *
	 * @example
	 * ```ts
	 * const nothing = Maybe.nothing<string>();
	 * nothing.isNothing(); // Returns true
	 * ```
	 *
	 * @returns A new Maybe instance containing Nothing
	 */
	static nothing<T>(): Maybe<T> {
		return new Maybe<T>(false);
	}

	/**
	 * Creates a new Maybe containing the provided value (Just).
	 *
	 * @example
	 * ```ts
	 * const just = Maybe.just("hello");
	 * just.isJust(); // Returns true
	 * just.unwrap(); // Returns "hello"
	 * ```
	 *
	 * @param value The value to wrap in a Maybe
	 * @returns A new Maybe instance containing the value
	 */
	static just<T>(value: T): Maybe<T> {
		const maybe = new Maybe<T>(true);
		maybe.setValue(value);
		return maybe;
	}

	toString(): string {
		if (this.isNothing()) {
			return "Nothing";
		}

		return `Just<${toString(this.unwrap())}>`;
	}
}
