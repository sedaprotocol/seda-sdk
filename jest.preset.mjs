import nxPreset from '@nx/jest/preset/index.js';

export default {
  ...nxPreset,
  extensionsToTreatAsEsm: ['.ts'],
};
