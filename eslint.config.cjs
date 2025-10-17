const globals = require('globals');

module.exports = {
  files: ['**/*.{js,cjs}'],
  languageOptions: {
    globals: globals.node,
    sourceType: 'module',
    parserOptions: { ecmaVersion: 'latest' },
  },
  rules: {
    'no-unused-vars': 'warn',
    'no-undef': 'error',
    'no-console': 'off',
    'prettier/prettier': 'error',
  },
  plugins: ['prettier'],
  extends: ['eslint:recommended', 'prettier'],
};
