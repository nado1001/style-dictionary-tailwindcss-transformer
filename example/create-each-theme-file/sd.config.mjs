import StyleDictionaryModule from 'style-dictionary'
import { makeSdTailwindConfig } from 'sd-tailwindcss-transformer'

StyleDictionaryModule.registerTransform({
  type: `value`,
  transitive: true,
  name: `tailwind/font/px`,
  filter: function (token) {
    return token.attributes.category === 'fontSize'
  },
  transform: function ({ value }) {
    if (value.indexOf('px') !== -1) {
      return value
    }

    return `${value}px`
  }
})

const types = ['colors', 'fontSize']

types.map((type) => {
  const StyleDictionary = new StyleDictionaryModule(
    makeSdTailwindConfig({
      type,
      transforms: ['attribute/cti', 'name/kebab', 'tailwind/font/px']
    })
  )

  StyleDictionary.buildAllPlatforms()
})
