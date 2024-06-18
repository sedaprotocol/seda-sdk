import {
  PostDataRequestArgs,
  getDataRequestId,
} from "./models/data-request.js";
import { getLatestProxyAddress } from "./services/get-latetst-proxy-address.js";
import { Signer } from "./signer.js";

export async function postDataRequest(
  callParams: PostDataRequestArgs,
  signer: Signer
) {
  const dataRequestId = getDataRequestId({
    drBinaryId: callParams.drBinaryId,
    drInputs: callParams.drInputs,
    version: callParams.version ?? "0.0.1",
    tallyBinaryId: callParams.tallyBinaryId ?? callParams.drBinaryId,
    tallyInputs: callParams.tallyInputs,
    replicationFactor: callParams.replicationFactor ?? 1,
    gasPrice: callParams.gasPrice ?? 1,
    gasLimit: callParams.gasLimit ?? 300000,
    memo: callParams.memo ?? new Uint8Array(),
  });

  const client = signer.client.unwrapOrElse(() => {
    throw new Error("No client on signer available");
  });
  const account = signer.account.unwrapOrElse(() => {
    throw new Error("No address on signer available");
  });

  console.log("[DEBUG]: signer ::: ", signer.rpcEndpoint);
  const proxyAddress = await getLatestProxyAddress(signer.rpcEndpoint);
  console.log("[DEBUG]: proxyAddress ::: ", proxyAddress);

  // const message = {
  //   typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
  //   value: {
  //     sender: account,
  //     contract: PROXY_CONTRACT,
  //     msg: btoa(drContents),
  //   },
  // };
}

/**
 * @todo Allow users to simulate a data request and calculate it's gas usage.
 */
export function simulateDataRequest() {}
