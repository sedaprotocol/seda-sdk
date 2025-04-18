export class VmError extends Error {
    constructor(message?: string, options?: ErrorOptions) {
        super(`VmError(${message})`, options);
    }
}