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
			Process.success(Bytes.fromUtf8String("rejected"));
		} else {
			Process.error(Bytes.fromUtf8String("Test failed"));
		}
	}
}

@json
class TodoResponse {
	userId!: i64;
	id!: i64;
	title!: string;
	completed!: boolean;
}

export class TestHttpSuccess extends OracleProgram {
	execution(): void {
		const response = httpFetch("https://jsonplaceholder.typicode.com/todos/1");

		if (response.isFulfilled()) {
			const data = response.unwrap().bytes.toJSON<TodoResponse>();
			Process.success(
				Bytes.fromUtf8String(
					`${data.userId}:${data.id}:${data.title}:${data.completed}`,
				),
			);
		}

		if (response.isRejected()) {
			Process.error(response.unwrapRejected().bytes);
		}

		Process.error(Bytes.fromUtf8String("Something went wrong.."), 20);
	}
}

@json
class PostResponse {
	title!: string;
	body!: string;
	id!: i64;
}

export class TestPostHttpSuccess extends OracleProgram {
	execution(): void {
		const headers = new Map<string, string>();
		headers.set("content-type", "application/json");

		const response = httpFetch("https://jsonplaceholder.typicode.com/posts", {
			body: Bytes.fromUtf8String(
				`{"title":"Test SDK","body":"Don't forget to test some integrations."}`,
			),
			method: "POST",
			headers,
		});

		if (response.isFulfilled()) {
			const data = response.unwrap().bytes.toJSON<PostResponse>();
			Process.success(
				Bytes.fromUtf8String(`${data.id}:${data.title}:${data.body}`),
			);
		}

		if (response.isRejected()) {
			Process.error(response.unwrap().bytes);
		}

		Process.error(Bytes.fromUtf8String("Something went wrong.."), 20);
	}
}
