const rootEslint = require('../../.eslintrc.cjs');

module.exports = {
  ...rootEslint,
  rules: {
    ...rootEslint.rules,
    'import/extensions': [0],
  },
};
