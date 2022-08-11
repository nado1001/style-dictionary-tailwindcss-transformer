module.exports = {
  env: { es6: true, node: true, jest: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { project: './tsconfig.json' },
  plugins: ['import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
    'prettier'
  ],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'info', 'error'] }],
    'prefer-const': 'error',

    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/explicit-function-return-type': ['off'],
    '@typescript-eslint/explicit-module-boundary-types': ['off'],
    '@typescript-eslint/no-empty-function': ['off'],
    '@typescript-eslint/no-explicit-any': ['off'],
    'import/prefer-default-export': ['off'],
    '@typescript-eslint/ban-types': ['warn']
  }
}
