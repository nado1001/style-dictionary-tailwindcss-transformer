module.exports = {
  env: { es6: true, node: true, jest: true },
  plugins: [
    'import'
  ],
  extends: [
    'eslint:recommended',
    'prettier'
  ],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'info', 'error'] }],
  }
}