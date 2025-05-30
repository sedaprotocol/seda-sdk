export enum VmErrorType {
	OutOfGas = "OutOfGas",
	HttpFetchTimeout = "HttpFetchTimeout",
	HttpFetchGlobalTimeout = "HttpFetchGlobalTimeout",
	InsufficientDataProxyFee = "InsufficientDataProxyFee",
	Unknown = "Unknown",
}

interface VmErrorOptions extends ErrorOptions {
	type: VmErrorType;
}

export class VmError extends Error {
	public type: VmErrorType;

	constructor(message?: string, options?: VmErrorOptions) {
		// Important we wrap the message in VmError to be able to extract the actual error message
		super(`VmError(${message})`, options);

		this.type = options?.type ?? VmErrorType.Unknown;
	}
}
