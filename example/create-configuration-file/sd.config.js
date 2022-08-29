const StyleDictionaryModule = require('style-dictionary')
const { sdTailwindConfig } = require('sd-tailwindcss-transformer')

const StyleDictionary = StyleDictionaryModule.extend(
  sdTailwindConfig({ type: 'all' })
)

StyleDictionary.buildAllPlatforms()
