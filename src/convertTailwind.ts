import { Dictionary } from 'style-dictionary/types'
import { arrayToNestedObject, unquoteFromKeys } from './utils'

const createTailwindFormat = (dictionary: Dictionary, type: string) => {
  const tokens = dictionary.allTokens

  const tokenObj = tokens.reduce((acc: any, cur) => {
    if (cur.attributes !== undefined && cur.attributes.category === type) {
      acc[cur.path.join('.')] = cur.value
    }
    return acc
  }, {})

  let result = {}

  Object.keys(tokenObj).forEach((key) => {
    const keys = key.split('.')
    arrayToNestedObject({
      obj: result,
      keyPath: keys,
      value: tokenObj[key]
    })
  })

  const json = JSON.stringify(result, null, 2)

  let configs = 'module.exports = '
  configs += unquoteFromKeys(json)

  return configs
}

export const getSdTailwindConfig = (type: string) => {
  return {
    source: [`tokens/**/*.json`],
    format: {
      tailwindFormat: ({ dictionary }: { dictionary: Dictionary }) => {
        return createTailwindFormat(dictionary, type)
      }
    },
    platforms: {
      [`tailwind/${type}`]: {
        transforms: ['attribute/cti', 'name/cti/kebab', 'size/rem'],
        buildPath: `build/web/`,
        files: [
          {
            destination: `${type}.tailwind.js`,
            format: 'tailwindFormat'
          }
        ]
      }
    }
  }
}
