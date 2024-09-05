import {
	Bytes,
	OracleProgram,
	Process,
	httpFetch,
} from "../../as-sdk/assembly/index";

export class TestHttpRejection extends OracleProgram {
	execution(): void {
		const response = httpFetch("example.com/");

		if (response.isRejected()) {
			Process.success(Bytes.fromString("rejected"));
		} else {
			Process.error(Bytes.fromString("Test failed"));
		}
	}
}

export class TestHttpSuccess extends OracleProgram {
	execution(): void {
		const response = httpFetch("https://jsonplaceholder.typicode.com/todos/1");

		if (response.isFulfilled()) {
			Process.success(response.unwrap().bytes);
		}

		if (response.isRejected()) {
			Process.error(response.unwrapRejected().bytes);
		}

		Process.error(Bytes.fromString("Something went wrong.."), 20);
	}
}

export class TestPostHttpSuccess extends OracleProgram {
	execution(): void {
		const headers = new Map<string, string>();
		headers.set("content-type", "application/json");

		const response = httpFetch("https://jsonplaceholder.typicode.com/posts", {
			body: Bytes.fromString(
				`{"title":"Test SDK","body":"Don't forget to test some integrations."}`,
			),
			method: "POST",
			headers,
		});

		if (response.isFulfilled()) {
			Process.success(response.unwrap().bytes);
		}

		if (response.isRejected()) {
			Process.error(response.unwrap().bytes);
		}

		Process.error(Bytes.fromString("Something went wrong.."), 20);
	}
}
