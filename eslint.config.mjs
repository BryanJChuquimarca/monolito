import { defineConfig } from 'eslint/config';
import globals from 'globals';
import prettierPlugin from 'eslint-plugin-prettier';

export default defineConfig({
  files: ['**/*.{js,mjs,cjs}'],
  languageOptions: {
    globals: globals.node,
    sourceType: 'module',
    parserOptions: { ecmaVersion: 'latest' },
  },
  plugins: {
    prettier: prettierPlugin, // se pasa como objeto
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'], // ahora usa el shareable config de Prettier
  rules: {
    'no-unused-vars': 'warn',
    'no-undef': 'error',
    'no-console': 'off',
    'prettier/prettier': 'error',
  },
});
