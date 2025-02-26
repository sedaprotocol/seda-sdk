export function JSONStringify(obj: unknown) {
	return JSON.stringify(obj, (_, v) =>
		typeof v === "bigint" ? v.toString() : v,
	);
}
