import { defineConfig } from 'eslint/config';
import globals from 'globals';
import prettierPlugin from 'eslint-plugin-prettier';
import js from '@eslint/js';

export default defineConfig([
  js.configs.recommended,

  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
    },
  },

  {
    files: ['**/*.{js,mjs,cjs}'],

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        isUser: 'writable',
        isAdmin: 'writable',
      },
      sourceType: 'module',
      parserOptions: { ecmaVersion: 'latest' },
    },

    rules: {

      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'no-console': 'off',
    },
  },
]);

