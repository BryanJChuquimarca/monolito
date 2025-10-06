import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import pluginPrettier from 'eslint-plugin-prettier';

export default defineConfig([
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    ...js.configs.recommended,

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },

    rules: {
      quotes: ['error', 'single'],
    },
  },
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: [
      'json/recommended',
      'eslint:recommended',
      'plugin:prettier/recommended',
    ],
  },
  
]);
