import StyleDictionaryModule from 'style-dictionary'
import { makeSdTailwindConfig } from 'sd-tailwindcss-transformer'
// import { makeSdTailwindConfig } from '../../dist/index.js'

const PREFIX = 'tw-'

const sdConfig = makeSdTailwindConfig({
  type: 'all',
  formatType: 'cjs',
  isVariables: true,
  prefix: PREFIX,
  extend: true,
  source: [`./style-dictionary/tokens/**/*.json`],
  transforms: ['attribute/cti', 'name/kebab'],
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

const StyleDictionary = new StyleDictionaryModule(sdConfig)
await StyleDictionary.hasInitialized
await StyleDictionary.buildAllPlatforms()
