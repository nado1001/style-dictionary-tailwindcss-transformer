import type { Dictionary, Platform, Config } from 'style-dictionary/types'
import type { Config as TailwindConfig } from 'tailwindcss/types'
import { getConfigValue, makeNestedObject, unquoteFromKeys } from './utils'

type SdTailwindConfigType = {
  type: 'all' | string
  source?: Config['source']
  transforms?: Platform['transforms']
  buildPath?: Platform['buildPath']
  tailwind?: Pick<TailwindConfig, 'content' | 'darkMode'> & {
    plugins: Array<'typography' | 'forms' | 'aspect-ratio' | 'line-clamp'>
  }
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
    const darkMode = getConfigValue(tailwind?.darkMode, 'class')
    const tailwindContent = getConfigValue(tailwind?.content, [
      './src/**/*.{ts,tsx}'
    ])
    const tailwindPlugins = getConfigValue(
      tailwind?.plugins.map((plugin) => {
        return `require("@tailwindcss/${plugin}")`
      }),
      []
    )

    configs = `
/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["${tailwindContent}"],
  darkMode: "${darkMode}",
  theme: {
    extend: ${unquoteFromKeys(content, type)},
  },`
    if (tailwindPlugins.length > 0) {
      configs += `\n  plugins: [${tailwindPlugins}]`
    }
    configs += `\n}`
  } else {
    configs = `module.exports = ${unquoteFromKeys(content)}`
  }

  return configs
}

export const makeSdTailwindConfig = ({
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
