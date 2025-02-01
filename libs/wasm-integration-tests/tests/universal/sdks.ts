import { oracleProgram as asSdkOracleProgram } from "../as-sdk/oracle-program";
import { oracleProgram as rsSdkOracleProgram } from "../rs-sdk/oracle-program";
import { oracleProgram as goSdkOracleProgram } from "../go-sdk/oracle-program";
export const sdks = [
	["as-sdk", asSdkOracleProgram],
	["rs-sdk", rsSdkOracleProgram],
	["go-sdk", goSdkOracleProgram],
] as const;
