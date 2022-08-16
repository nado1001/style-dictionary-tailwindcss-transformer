import type { Dictionary, Config } from 'style-dictionary/types'
import { arrayToNestedObject, unquoteFromKeys } from './utils'

const getTailwindFormatObj = (
  dictionary: Dictionary,
  type: string,
  tailwind?: {
    mode: string
    purge: string[]
    darkMode: string
  }
) => {
  const tokens = dictionary.allTokens

  const tokenObj = tokens.reduce<{ [key: string]: string }>((acc, cur) => {
    if (cur.attributes === undefined) {
      throw new Error(`Token ${cur.name} has no attributes`)
    }

    if (cur.attributes.category === type || type === 'all') {
      acc[cur.path.join('.')] = cur.value
    }

    return acc
  }, {})

  const result = {}

  Object.keys(tokenObj).forEach((key) => {
    const keys = key.split('.').filter((k) => k !== type)

    arrayToNestedObject(result, keys, tokenObj[key])
  })

  const json = JSON.stringify(result, null, 2)

  let configs
  if (type === 'all') {
    configs = `module.exports = {
  mode: "${tailwind?.mode ?? 'jit'}",
  purge: ${JSON.stringify(tailwind?.purge ?? ['./src/**/*.{ts,tsx}'])},
  darkMode: "${tailwind?.darkMode ?? 'class'}",
  theme: {
    extend: ${unquoteFromKeys(json)},
  }
}`
  } else {
    configs = `module.exports = ${unquoteFromKeys(json)}`
  }

  return configs
}

export const makeSdTailwindConfig = (
  type: string,
  tailwind: {
    mode: string
    purge: string[]
    darkMode: string
  }
): Config => {
  if (type === undefined) {
    throw new Error('type is required')
  }

  return {
    source: [`tokens/**/*.json`],
    format: {
      tailwindFormat: ({ dictionary }: { dictionary: Dictionary }) => {
        return getTailwindFormatObj(dictionary, type, tailwind)
      }
    },
    platforms: {
      [type !== 'all' ? `tailwind/${type}` : 'tailwind']: {
        transforms: ['attribute/cti', 'name/cti/kebab', 'size/rem'],
        buildPath: `build/web/`,
        files: [
          {
            destination:
              type !== 'all' ? `${type}.tailwind.js` : 'tailwind.config.js',
            format: 'tailwindFormat'
          }
        ]
      }
    }
  }
}
