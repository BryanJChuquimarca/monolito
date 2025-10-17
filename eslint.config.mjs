import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended', 'plugin:prettier/recommended'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      parserOptions: { ecmaVersion: 'latest' },
      globals: { ...globals.es2023, ...globals.common },
    },
  },

  js.configs.recommended,
]);
