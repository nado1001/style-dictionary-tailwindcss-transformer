import StyleDictionaryModule from 'style-dictionary'
import { makeSdTailwindConfig } from 'sd-tailwindcss-transformer'

// Tailwind CSS v4 CSS-first workflow.
// `formatType: 'css'` emits a self-contained stylesheet that uses the v4
// `@theme` directive instead of a v3-style `tailwind.config.js`.
const StyleDictionary = new StyleDictionaryModule(
  makeSdTailwindConfig({
    type: 'all',
    formatType: 'css',
    tailwind: {
      darkMode: 'class',
      plugins: ['typography', 'container-queries']
    }
  })
)

await StyleDictionary.hasInitialized
await StyleDictionary.buildAllPlatforms()
