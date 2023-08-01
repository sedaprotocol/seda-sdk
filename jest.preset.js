const nxPreset = require('@nx/jest/preset').default;

nxPreset.transform['^.+\\.(ts|js|html)$'][1].useESM = true;

module.exports = {
  ...nxPreset,
  extensionsToTreatAsEsm: ['.ts'],
};
