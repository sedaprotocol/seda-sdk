import {
	Bytes,
	Console,
	OracleProgram,
	Process,
	u128,
	u256,
} from "../../as-sdk/assembly";

export class TestBytesSliceNoArguments extends OracleProgram {
	execution(): void {
		const input = Process.getInputs();

		const copy = input.slice();
		copy.value.fill(0);
		Console.log(copy.toUtf8String());

		Process.success(input);
	}
}

export class TestBytesSliceOnlyStart extends OracleProgram {
	execution(): void {
		const input = Process.getInputs();

		const copy = input.slice(14);

		Process.success(copy);
	}
}

export class TestBytesSliceStartEnd extends OracleProgram {
	execution(): void {
		const input = Process.getInputs();

		const copy = input.slice(9, 14);

		Process.success(copy);
	}
}

export class TestBytesConcat extends OracleProgram {
	execution(): void {
		const input = Process.getInputs();

		// Input starts with "testBytesConcat:"
		const data = input.slice(16);

		const result = Bytes.fromUtf8String("Hello, ").concat(data);

		Process.success(result);
	}
}

export class TestBytesStaticConcat extends OracleProgram {
	execution(): void {
		const input = Process.getInputs();

		// Input starts with "TestBytesStaticConcat:"
		const start = input.slice(0, 21);
		const middle = input.slice(21, 22);
		const end = input.slice(22);

		const result = Bytes.concat([end, middle, start]);

		Process.success(result);
	}
}

@json
class NestedItem {
	id!: i64;
	value!: string;
}
@json
class Test {
	id!: i64;
	value!: string;
	important!: boolean;
	list!: string[];
	nested!: NestedItem;
}
@json
class Output {
	id!: i64;
	firstList!: string;
	nestedValue!: string;
}

export class TestBytesJSON extends OracleProgram {
	execution(): void {
		const input = Process.getInputs();

		// Input starts with "testBytesJSON:"
		const data = input.slice(14).toJSON<Test>();
		const output = new Output();
		output.id = data.id;
		output.firstList = data.list.at(0);
		output.nestedValue = data.nested.value;

		Process.success(Bytes.fromJSON(output));
	}
}

export class TestBytesToNumber extends OracleProgram {
	execution(): void {
		const input = Bytes.fromHexString("0xfe");
		const number = input.toNumber<u8>();

		// Check if we can use big endian numbers
		const inputu64 = Bytes.fromHexString("0x00000000000000f3");
		const numberU64 = inputu64.toNumber<u64>(true);

		const result = `${number.toString()}:${numberU64.toString()}`;
		Process.success(Bytes.fromUtf8String(result));
	}
}

export class TestNumberToBytes extends OracleProgram {
	execution(): void {
		const num1 = Bytes.fromNumber<u64>(u64.MAX_VALUE);
		const num2 = Bytes.fromNumber<i64>(i64.MIN_VALUE, true);

		// Convert both back
		const result1 = num1.toNumber<u64>();
		const result2 = num2.toNumber<i64>(true);

		const result = `${num1.toHexString()}:${num2.toHexString()}:${result1}:${result2}`;
		Process.success(Bytes.fromUtf8String(result));
	}
}

export class TestBigNumberToBytes extends OracleProgram {
	execution(): void {
		const num1 = Bytes.fromNumber<u128>(u128.Max);
		const num2 = Bytes.fromNumber<u128>(u128.from(987654321), true);
		const num3 = Bytes.fromNumber<u256>(u256.Max);
		const num4 = Bytes.fromNumber<u256>(u256.from(123456789), true);

		// Convert everything back
		const result1 = num1.toU128();
		const result2 = num2.toU128(true);
		const result3 = num3.toU256();
		const result4 = num4.toU256(true);

		const result = `${num1.toHexString()}:${result1.toString()},${num2.toHexString()}:${result2},${num3.toHexString()}:${result3},${num4.toHexString()}:${result4}`;
		Process.success(Bytes.fromUtf8String(result));
	}
}

export class TestBytesToBigNumber extends OracleProgram {
	execution(): void {
		const input = Bytes.fromHexString("0x0000000000000000000000003ade68b1");
		const number = input.toU128();

		const inputU256 = Bytes.fromHexString(
			"0x00000000000000000000000000000000000000000000000000000000075bcd15",
		);
		const numberU256 = inputU256.toU256(true);

		const result = `${number.toString()}:${numberU256.toString()}`;
		Process.success(Bytes.fromUtf8String(result));
	}
}

export class TestBytesHexEncodeDecode extends OracleProgram {
	execution(): void {
		const input = Bytes.fromHexString(
			"006e75ec00000000000000000000000000000000000000000000",
		);

		Process.success(Bytes.fromUtf8String(input.toHexString()));
	}
}

export class TestBytesPrefixedHexDecode extends OracleProgram {
	execution(): void {
		const input = Bytes.fromHexString(
			"0x006e75ec00000000000000000000000000000000000000000000",
		);

		Process.success(Bytes.fromUtf8String(input.toHexString()));
	}
}
