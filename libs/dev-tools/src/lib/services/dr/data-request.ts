export class DataRequest {
	id: string;
	height: bigint;

	constructor(id: string, height: bigint) {
		this.id = id;
		this.height = height;
	}

	toString() {
		return `DataRequest(id: ${this.id}, height: ${this.height})`;
	}
}
