import { defineConfig } from 'tsup'

const isProd = process.env.NODE_ENV === 'production'

export default defineConfig([
  {
    entry: ['src/index.ts'],
    clean: true,
    watch: !isProd,
    format: ['cjs'],
    minify: isProd,
    treeshake: isProd,
    sourcemap: !isProd
  }
])
