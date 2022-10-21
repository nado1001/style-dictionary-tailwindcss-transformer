import type { Dictionary, Platform, Config } from 'style-dictionary/types'
import type { Config as TailwindConfig } from 'tailwindcss/types'
import { getConfigValue, makeNestedObject, unquoteFromKeys } from './utils'

type TailwindOptions = Pick<TailwindConfig, 'content' | 'darkMode'> & {
  plugins: Array<
    'typography' | 'forms' | 'aspect-ratio' | 'line-clamp' | 'container-queries'
  >
}

type SdTailwindConfigType = {
  type: 'all' | string
  isVariables?: boolean
  source?: Config['source']
  transforms?: Platform['transforms']
  buildPath?: Platform['buildPath']
  tailwind?: Partial<TailwindOptions>
}

type TailwindFormatObjType = Pick<
  SdTailwindConfigType,
  'type' | 'isVariables' | 'tailwind'
> & {
  dictionary: Dictionary
}

const formatTokens = (
  tokens: Dictionary['allTokens'],
  type: SdTailwindConfigType['type'],
  isVariables: SdTailwindConfigType['isVariables']
) => {
  const allTokenObj = tokens.reduce<Record<string, string>>((acc, cur) => {
    if (cur.attributes === undefined) {
      throw new Error(`Token ${cur.name} has no attributes`)
    }

    if (cur.attributes.category === type || type === 'all') {
      if (isVariables) {
        acc[cur.path.join('.')] = `var(--${cur.name})`
      } else {
        acc[cur.path.join('.')] = cur.value
      }
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
  isVariables,
  tailwind
}: TailwindFormatObjType) => {
  const content = formatTokens(allTokens, type, isVariables)

  if (type === 'all') {
    const darkMode = getConfigValue(tailwind?.darkMode, 'class')
    const tailwindContent = getConfigValue(
      Array.isArray(tailwind?.content)
        ? tailwind?.content.map((content) => `"${content}"`)
        : tailwind?.content,
      [`"./src/**/*.{ts,tsx}"`]
    )
    const plugins = getConfigValue(
      tailwind?.plugins?.map((plugin) => {
        return `require("@tailwindcss/${plugin}")`
      }),
      []
    )

    let configs = `/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [${tailwindContent}],
  darkMode: "${darkMode}",
  theme: {
    extend: ${unquoteFromKeys(content, type)},
  },`

    if (plugins.length > 0) {
      configs += `\n  plugins: [${plugins}]`
    }
    configs += '\n}'
    return configs
  } else {
    return `module.exports = ${unquoteFromKeys(content)}`
  }
}

export const makeSdTailwindConfig = ({
  type,
  isVariables = false,
  source,
  transforms,
  buildPath,
  tailwind
}: SdTailwindConfigType): Config => {
  if (type === undefined) {
    throw new Error('type is required')
  }

  return {
    source: getConfigValue(source, ['tokens/**/*.json']),
    format: {
      tailwindFormat: ({ dictionary }: { dictionary: Dictionary }) => {
        return getTailwindFormat({ dictionary, isVariables, type, tailwind })
      }
    },
    platforms: {
      [type !== 'all' ? `tailwind/${type}` : 'tailwind']: {
        transforms: getConfigValue(transforms, [
          'attribute/cti',
          'name/cti/kebab'
        ]),
        buildPath: getConfigValue(buildPath, 'build/web/'),
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
