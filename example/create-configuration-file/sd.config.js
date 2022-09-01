const StyleDictionaryModule = require('style-dictionary')
const { makeSdTailwindConfig } = require('sd-tailwindcss-transformer')

const StyleDictionary = StyleDictionaryModule.extend(
  makeSdTailwindConfig({
    type: 'all',
    tailwind: {
      plugins: ['forms', 'typography']
    }
  })
)

StyleDictionary.buildAllPlatforms()
