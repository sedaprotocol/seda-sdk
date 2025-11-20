import type { Maybe } from "true-myth";
import type { WASI } from "uwasi";
import { CallType, type GasMeter } from "../../metering";
import type { VmAdapter } from "../../types/vm-adapter";

const ABI_WASI_CLOCK_MONOTONIC = 1;
const ABI_WASI_CLOCK_REALTIME = 0;
const ABI_WASI_ENOSYS = 52;
const ABI_WASI_ESUCCESS = 0;

export function clock_time_get(
	vmAdapter: Maybe<VmAdapter>, // TODO: Can be none due the usage of the SharedArrayBuffer. We should get rid of this.
	wasi: WASI,
	gasMeter: GasMeter,
	...args: number[]
) {
	gasMeter.applyGasCost(CallType.ClockTimeGet, BigInt(0));
	const [clockId, precision, time] = args;

	// Taken from uwasi/lib/esm/features/clock.js
	let nowMs = 0;
	switch (clockId) {
		case ABI_WASI_CLOCK_MONOTONIC: {
			nowMs = vmAdapter.match({
				Just: (adapter) => adapter.getClockTime("monotonic"),
				Nothing: () => performance.now(),
			});
			break;
		}
		case ABI_WASI_CLOCK_REALTIME: {
			nowMs = vmAdapter.match({
				Just: (adapter) => adapter.getClockTime("realtime"),
				Nothing: () => Date.now(),
			});
			break;
		}
		default:
			return ABI_WASI_ENOSYS;
	}

	// @ts-expect-error - view is private and only accessible within class 'WASI'.
	const view: DataView = wasi.view();

	if (BigInt) {
		const msToNs = (ms: number) => {
			const msInt = Math.trunc(ms);
			const decimal = BigInt(Math.round((ms - msInt) * 1000000));
			const ns = BigInt(msInt) * BigInt(1000000);
			return ns + decimal;
		};
		const now = BigInt(msToNs(nowMs));
		view.setBigUint64(time, now, true);
	} else {
		// Fallback to two 32-bit numbers losing precision
		const now = Date.now() * 1000000;
		view.setUint32(time, now & 0x0000ffff, true);
		view.setUint32(time + 4, now & 0xffff0000, true);
	}

	return ABI_WASI_ESUCCESS;
}
