import { Result } from "true-myth";
import { buildQueryService } from "./query.js";
import { tryAsync } from "./try-async.js";

export async function getLatestProxyAddress(
  rpcEndpoint: string
): Promise<Result<string, string>> {
  const queryService = await tryAsync(
    async () => await buildQueryService(rpcEndpoint)
  );
  if (queryService.isErr)
    return Result.err(`buildQueryService - ${queryService.error}`);

  console.log("[DEBUG]: queryService ::: ", queryService.value);

  const queryResult = await tryAsync(
    async () => await queryService.value.ProxyContractRegistry({})
  );
  return queryResult.map((v) => v.address);
}
