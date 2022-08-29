const StyleDictionaryModule = require('style-dictionary')
const { sdTailwindConfig } = require('sd-tailwindcss-transformer')

StyleDictionaryModule.registerTransform({
  type: `value`,
  transitive: true,
  name: `tailwind/font/px`,
  matcher: function (token) {
    return token.attributes.category === 'fontSize'
  },
  transformer: function ({ value }) {
    if (value.indexOf('px') !== -1) {
      return value
    }

    return `${value}px`
  }
})

const types = ['colors', 'fontSize']

types.map((type) => {
  const StyleDictionary = StyleDictionaryModule.extend(
    sdTailwindConfig({
      type,
      transforms: ['attribute/cti', 'name/cti/kebab', 'tailwind/font/px']
    })
  )

  StyleDictionary.buildAllPlatforms()
})
