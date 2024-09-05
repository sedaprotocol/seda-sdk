import { Result } from "true-myth";
import * as v from "valibot";

export function trySync<T>(callback: () => T): Result<T, unknown> {
	try {
		return Result.ok(callback());
	} catch (error) {
		return Result.err(error);
	}
}

export async function tryAsync<T>(
	callback: () => Promise<T>,
): Promise<Result<T, unknown>> {
	try {
		return Result.ok(await callback());
	} catch (error) {
		return Result.err(error);
	}
}

type SafeParseArguments = Parameters<typeof v.safeParse>;
export function tryParseSync<T extends v.GenericSchema<unknown, unknown>>(
	schema: T,
	input: SafeParseArguments[1],
	info?: SafeParseArguments[2],
): Result<v.InferOutput<T>, v.GenericIssue[]> {
	const result = v.safeParse(schema, input, info);

	if (result.success) {
		return Result.ok(result.output);
	}

	return Result.err(result.issues);
}
