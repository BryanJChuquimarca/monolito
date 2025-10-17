// eslint.config.mjs (CORREGIDO)
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import prettierPlugin from 'eslint-plugin-prettier';
import js from '@eslint/js';

export default defineConfig([
  // 1. Configuración Base de ESLint (antes era parte de 'extends')
  js.configs.recommended,

  // 2. Plugin de Prettier y su configuración (antes era parte de 'extends')
  {
    plugins: {
      prettier: prettierPlugin, // Sólo se define el plugin aquí
    },
    rules: {
      'prettier/prettier': 'error',
      // Agregamos una regla de ESLint que Prettier pueda deshabilitar (para evitar conflictos)
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
    },
  },

  // 3. Configuración específica de tu proyecto
  {
    // Define los archivos a lint
    files: ['**/*.{js,mjs,cjs}'],

    // Configuración del entorno
    languageOptions: {
      // Combina globals de Node.js y browser (aunque elegiste 'browser' en init, 'node' es crucial para 'process')
      globals: {
        ...globals.node,
        ...globals.browser,
        isUser: 'writable',
        isAdmin: 'writable',
      },
      sourceType: 'module',
      parserOptions: { ecmaVersion: 'latest' },
    },

    // El entorno 'node' lo incluimos en globals arriba, pero también lo puedes poner aquí
    // Reglas personalizadas
    rules: {
      // Esto soluciona los errores 'process' y 'isUser' si los defines en otro lado como globales
      // Si 'isUser' y 'isAdmin' son variables definidas en otro archivo, DEBES quitarlas de aquí
      // y asegurarte de que estén correctamente importadas o definidas como globales si es el caso.
      // Si son variables de Node, el 'globals.node' ya debería ser suficiente.
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'no-console': 'off',
    },
  },
]);

// Nota: Hemos eliminado las propiedades 'plugins' y 'extends' del objeto principal.
