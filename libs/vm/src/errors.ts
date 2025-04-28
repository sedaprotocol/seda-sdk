export class VmError extends Error {
	constructor(message?: string, options?: ErrorOptions) {
		// Important we wrap the message in VmError to be able to extract the actual error message
		super(`VmError(${message})`, options);
	}
}
