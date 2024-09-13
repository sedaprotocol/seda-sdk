import { Bytes } from "./bytes";
import Process from "./process";

/**
 * A class meant to be extended with the custom implementation of an Oracle Program. Takes care of
 * executing the correct code depending on the phase of the Data Request.
 *
 * @category Program
 * @example
 * ```ts
	class MyOracleProgram extends OracleProgram {
		execution(): void {
			Process.success(Bytes.fromUtf8String("Hello from execution phase"));
		}
		tally(): void {
			Process.success(Bytes.fromUtf8String("Hello from tally phase"));
		}
	}

	new MyOracleProgram().run();
 * ```
 */
export class OracleProgram {
	/**
	 * Meant to be overridden if the oracle program needs to execute logic in the execution phase.
	 */
	execution(): void {
		Process.error(Bytes.fromUtf8String("Execution not implemented"));
	}

	/**
	 * Meant to be overridden if the oracle program needs to execute logic in the tally phase.
	 */
	tally(): void {
		Process.error(Bytes.fromUtf8String("Tally not implemented"));
	}

	/**
	 * Method used to execute the correct part of the oracle program depending on the context in which it is run.
	 * Not meant to be overridden unless you know what you're doing.
	 */
	run(): void {
		if (Process.isDrVmMode()) {
			this.execution();
		} else {
			this.tally();
		}
	}
}
