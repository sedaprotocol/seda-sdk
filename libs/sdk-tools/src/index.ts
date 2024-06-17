import { postDataRequest } from './dr-post.js';
import { Signer } from './signer.js';

export type { PostDataRequestArgs } from './models/data-request';
export { postDataRequest } from './dr-post.js';

const signer = await Signer.fromEnv();

postDataRequest({
  drBinaryId: '',
  drInputs: new Uint8Array(),
  tallyInputs: new Uint8Array(),
}, signer);
