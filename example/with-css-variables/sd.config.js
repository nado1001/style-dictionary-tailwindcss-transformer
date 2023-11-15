const StyleDictionaryModule = require('style-dictionary')
const { makeSdTailwindConfig } = require('sd-tailwindcss-transformer')
// const { makeSdTailwindConfig } = require('../../dist')

const PREFIX = 'tw-'

const sdConfig = makeSdTailwindConfig({
  type: 'all',
  formatType: 'cjs',
  isVariables: true,
  prefix: PREFIX,
  source: [`./style-dictionary/tokens/**/*.json`],
  transforms: ['attribute/cti', 'name/cti/kebab'],
  buildPath: `./`,
  tailwind: {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}'
    ],
    plugins: ['typography', 'container-queries']
  }
})

sdConfig.platforms['css'] = {
  prefix: PREFIX,
  transformGroup: 'css',
  buildPath: './styles/',
  files: [
    {
      destination: 'tailwind.css',
      format: 'css/variables'
    }
  ]
}

const StyleDictionary = StyleDictionaryModule.extend(sdConfig)
StyleDictionary.buildAllPlatforms()
