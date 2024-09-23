import StyleDictionaryModule from 'style-dictionary'
import { makeSdTailwindConfig } from 'sd-tailwindcss-transformer'

const StyleDictionary = new StyleDictionaryModule(
  makeSdTailwindConfig({
    type: 'all',
    tailwind: {
      plugins: ['forms', 'typography']
    }
  })
)

await StyleDictionary.hasInitialized
await StyleDictionary.buildAllPlatforms()
