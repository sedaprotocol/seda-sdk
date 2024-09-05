import { Result } from "true-myth";

export async function tryOrAsync<T, E>(
	error: E,
	callback: () => Promise<T>,
): Promise<Result<T, E>> {
	try {
		return Result.ok(await callback());
	} catch {
		return Result.err(error);
	}
}

export async function tryAsync<T>(
	callback: () => Promise<T>,
): Promise<Result<T, string>> {
	try {
		return Result.ok(await callback());
	} catch (error) {
		return Result.err(`${error}`);
	}
}
