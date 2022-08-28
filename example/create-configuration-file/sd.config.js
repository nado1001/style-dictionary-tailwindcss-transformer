const StyleDictionaryModule = require('style-dictionary')
const { sdTailwindConfig } = require('../../dist')

const StyleDictionary = StyleDictionaryModule.extend(
  sdTailwindConfig({ type: 'all' })
)

StyleDictionary.buildAllPlatforms()
