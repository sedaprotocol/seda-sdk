import { toString } from './string-utils';

export class Console {
    static log<T = string>(message: T): void {
        console.log(toString(message));
    }

    static warn<T = string>(message: T): void {
        console.warn(toString(message));
    }

    static debug<T = string>(message: T): void {
        console.debug(toString(message));
    }

    static error<T = string>(message: T): void {
        console.error(toString(message));
    }
     
    static info<T = string>(message: T): void {
        console.info(toString(message));
    }
}