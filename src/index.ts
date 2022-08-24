import type { Dictionary, Platform, Config } from 'style-dictionary/types'
import { getConfigValue, makeNestedObject, unquoteFromKeys } from './utils'
import { Config as TailwindConfig } from 'tailwindcss/types'

type SdTailwindConfigType = {
  type: 'all' | string
  source?: Config['source']
  transforms?: Platform['transforms']
  buildPath?: Platform['buildPath']
  tailwind?: Pick<TailwindConfig, 'content' | 'darkMode'>
}

type TailwindFormatObjType = Pick<SdTailwindConfigType, 'type' | 'tailwind'> & {
  dictionary: Dictionary
}

const formatTokens = (
  tokens: Dictionary['allTokens'],
  type: SdTailwindConfigType['type']
) => {
  const allTokenObj = tokens.reduce<{ [key: string]: string }>((acc, cur) => {
    if (cur.attributes === undefined) {
      throw new Error(`Token ${cur.name} has no attributes`)
    }

    if (cur.attributes.category === type || type === 'all') {
      acc[cur.path.join('.')] = cur.value
    }

    return acc
  }, {})

  const result = {}
  Object.keys(allTokenObj).forEach((key) => {
    const keys = key.split('.').filter((k) => k !== type)
    makeNestedObject(result, keys, allTokenObj[key])
  })

  return JSON.stringify(result, null, 2)
}

const getTailwindFormat = ({
  dictionary: { allTokens },
  type,
  tailwind
}: TailwindFormatObjType) => {
  const content = formatTokens(allTokens, type)

  let configs

  if (type === 'all') {
    configs = `
/** @type {import('tailwindcss').Config} */
module.exports = {
mode: "jit",
content: ${JSON.stringify(tailwind?.content ?? ['./src/**/*.{ts,tsx}'])},
darkMode: "${tailwind?.darkMode ?? 'class'}",
theme: {
extend: ${unquoteFromKeys(content)},
}
}`
  } else {
    configs = `module.exports = ${unquoteFromKeys(content)}`
  }

  return configs
}

export const sdTailwindConfig = ({
  type,
  source,
  transforms,
  buildPath,
  tailwind
}: SdTailwindConfigType): Config => {
  if (type === undefined) {
    throw new Error('type is required')
  }

  return {
    source: getConfigValue(source, [`tokens/**/*.json`]),
    format: {
      tailwindFormat: ({ dictionary }: { dictionary: Dictionary }) => {
        return getTailwindFormat({ dictionary, type, tailwind })
      }
    },
    platforms: {
      [type !== 'all' ? `tailwind/${type}` : 'tailwind']: {
        transforms: getConfigValue(transforms, [
          'attribute/cti',
          'name/cti/kebab'
        ]),
        buildPath: getConfigValue(buildPath, `build/web/`),
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
