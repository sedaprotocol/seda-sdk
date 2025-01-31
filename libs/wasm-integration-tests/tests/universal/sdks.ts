import { oracleProgram as asSdkOracleProgram } from "../as-sdk/oracle-program";
import { oracleProgram as rsSdkOracleProgram } from "../rs-sdk/oracle-program";

export const sdks = [
	["as-sdk", asSdkOracleProgram],
	["rs-sdk", rsSdkOracleProgram],
] as const;
