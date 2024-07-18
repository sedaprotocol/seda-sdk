export interface ToString {
    toString(): string;
}

/**
 * Converts an generic type to a string
 * Takes into account the @json decorator or if defined the toString() method
 * 
 * @param message 
 * @returns 
 */
export function toString<T = string>(message: T): string {
    if (message === null) {
        return "null";
    }

    // @ts-expect-error
    if (isString<T>() || isDefined(message.toString)) {
        // @ts-expect-error
        return message.toString();
    }

    // @ts-expect-error
    if (isDefined(message.__SERIALIZE)) {
        // @ts-expect-error
        return message.__SERIALIZE();
    }

    return "[Object object]";
}