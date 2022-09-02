const StyleDictionaryModule = require('style-dictionary')
const { makeSdTailwindConfig } = require('sd-tailwindcss-transformer')

const sdConfig = makeSdTailwindConfig({
  type: 'all',
  isVariables: true,
  source: [`./style-dictionary/tokens/**/*.json`],
  transforms: ['attribute/cti', 'name/cti/kebab'],
  buildPath: `./`,
  tailwind: {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}'
    ]
  }
})

sdConfig.platforms['css'] = {
  transformGroup: 'css',
  buildPath: './styles/',
  files: [
    {
      destination: 'tailwind.css',
      format: 'css/variables',
      options: {
        outputReferences: true
      }
    }
  ]
}

const StyleDictionary = StyleDictionaryModule.extend(sdConfig)
StyleDictionary.buildAllPlatforms()
