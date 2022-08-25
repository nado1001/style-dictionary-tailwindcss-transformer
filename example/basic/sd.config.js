const StyleDictionaryModule = require('style-dictionary')
const { sdTailwindConfig } = require('../../dist')

let StyleDictionary = StyleDictionaryModule.extend({
  source: [`tokens/**/*.json`],
  format: {},
  platforms: {
    scss: {
      transformGroup: 'scss',
      buildPath: 'build/scss/',
      files: [
        {
          destination: '_tokens.scss',
          format: 'scss/variables',
          options: {
            outputReferences: true
          }
        }
      ]
    },
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [
        {
          destination: '_tokens.css',
          format: 'css/variables',
          options: {
            outputReferences: true
          }
        }
      ]
    }
  }
})

StyleDictionary.buildAllPlatforms()

const types = ['colors', 'fontSize']

types.map((type) => {
  console.log('\n==============================================')
  console.log(`\nProcessing: [${type}]`)

  StyleDictionary = StyleDictionaryModule.extend(
    sdTailwindConfig({
      type
    })
  )

  // StyleDictionary.cleanAllPlatforms()
  StyleDictionary.buildAllPlatforms()

  console.log('\nEnd processing')
})
