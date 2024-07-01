import { createSigningClient } from '../signing-client';
import { type ISigner } from '../signer';
import assert from 'assert';

type DataRequestStatus = 'pending' | 'committing' | 'revealing' | 'resolved';

export async function getDataRequestStatus(
  signer: ISigner,
  drId: string
): Promise<{ status: DataRequestStatus }> {
  const sigingClientResult = await createSigningClient(signer);
  if (sigingClientResult.isErr) {
    throw sigingClientResult.error;
  }

  const { client: sigingClient } = sigingClientResult.value;
  const contract = signer.getCoreContractAddress();

  const dr = await sigingClient.queryContractSmart(contract, {
    get_data_request: { dr_id: drId },
  });

  if (dr === null) {
    const drResult = await sigingClient.queryContractSmart(contract, {
      get_data_result: { dr_id: drId },
    });

    if (drResult === null) {
      throw new Error(`No DR found for id: "${drId}"`);
    }

    return { status: 'resolved' };
  }

  const replicationFactor = dr?.replication_factor;
  assert(
    Number.isInteger(replicationFactor),
    'Invalid DR response, replication factor is not a number.'
  );
  assert(
    typeof dr?.commits === 'object',
    'Invalid DR response, no commits map.'
  );
  assert(
    typeof dr?.reveals === 'object',
    'Invalid DR response, no reveals map.'
  );

  const commitments = Object.keys(dr.commits).length;
  const reveals = Object.keys(dr.reveals).length;

  const status = getStatus(replicationFactor, commitments, reveals);

  return { status };
}

function getStatus(
  replicationFactor: number,
  commitments: number,
  reveals: number
): DataRequestStatus {
  if (commitments === 0) {
    return 'pending';
  }
  if (commitments < replicationFactor) {
    return 'committing';
  }
  if (reveals < replicationFactor) {
    return 'revealing';
  }

  return 'resolved';
}
