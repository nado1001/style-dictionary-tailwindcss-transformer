const eslint = require('@eslint/js')
const tseslint = require('typescript-eslint')
const importPlugin = require('eslint-plugin-import')
const prettier = require('eslint-config-prettier')
const globals = require('globals')

module.exports = tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      'example/**',
      '*.js',
      '*.config.ts'
    ]
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { import: importPlugin },
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'info', 'error'] }],
      'prefer-const': 'error',
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/explicit-function-return-type': ['off'],
      '@typescript-eslint/explicit-module-boundary-types': ['off'],
      '@typescript-eslint/no-empty-function': ['off'],
      '@typescript-eslint/no-explicit-any': ['off'],
      'import/prefer-default-export': ['off']
    }
  },
  prettier
)
