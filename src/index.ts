import type { Config, Dictionary } from 'style-dictionary/types'
import type { SdTailwindConfigType, TailwindFormatObjType } from './types'
import {
  addHyphen,
  getConfigValue,
  makeSdObject,
  unquoteFromKeys,
  getTemplateConfigByType
} from './utils'

const formatTokens = (
  tokens: Dictionary['allTokens'],
  type: SdTailwindConfigType['type'],
  isVariables: SdTailwindConfigType['isVariables'],
  prefix: SdTailwindConfigType['prefix']
) => {
  const allTokenObj = tokens.reduce<Record<string, string>>((acc, cur) => {
    if (cur.attributes === undefined) {
      throw new Error(`Token ${cur.name} has no attributes`)
    }

    if (cur.attributes.category === type || type === 'all') {
      /**
       * Make sure screens values are not using CSS variables as
       * CSS @media queries do not support CSS variables
       */
      if (isVariables && cur.attributes.category !== 'screens') {
        acc[Object.values(cur.attributes).join('.')] = prefix
          ? `var(--${addHyphen(prefix) + cur.name})`
          : `var(--${cur.name})`
      } else {
        acc[Object.values(cur.attributes).join('.')] = cur["$value"] || cur["value"]
      }
    }

    return acc
  }, {})

  const result = {}
  Object.keys(allTokenObj).forEach((key) => {
    const keys = key.split('.').filter((k) => k !== type)
    makeSdObject(result, keys, allTokenObj[key], keys[0] !== 'typography')
  })

  return JSON.stringify(result, null, 2)
}

export const getTailwindFormat = ({
  dictionary: { allTokens },
  type,
  isVariables,
  prefix,
  extend,
  tailwind
}: TailwindFormatObjType) => {
  const content = formatTokens(allTokens, type, isVariables, prefix)

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

    const configs = getTemplateConfigByType(
      type,
      content,
      darkMode,
      tailwindContent,
      extend,
      plugins
    )

    return configs
  } else {
    return `module.exports = ${unquoteFromKeys(content)}`
  }
}

export const makeSdTailwindConfig = ({
  type,
  formatType = 'js',
  isVariables = false,
  extend = true,
  source,
  transforms,
  buildPath,
  prefix,
  tailwind,
  preprocessors
}: SdTailwindConfigType): Config => {
  if (type === undefined) {
    throw new Error('type is required')
  }

  if (formatType !== 'js' && formatType !== 'cjs') {
    throw new Error('formatType must be "js" or "cjs"')
  }

  const destination =
      type !== 'all'
          ? `${type}.tailwind.${formatType}`
          : `tailwind.config.${formatType}`

  return {
    preprocessors,
    source: getConfigValue(source, ['tokens/**/*.json']),
    hooks: {
      formats: {
        tailwindFormat: ({ dictionary }: { dictionary: Dictionary }) => {
          return getTailwindFormat({
            dictionary,
            formatType,
            isVariables,
            extend,
            prefix,
            type,
            tailwind
          })
        }
      }
    },
    platforms: {
      [type !== 'all' ? `tailwind/${type}` : 'tailwind']: {
        transforms: getConfigValue(transforms, [
          'attribute/cti',
          'name/kebab'
        ]),
        buildPath: getConfigValue(buildPath, 'build/web/'),
        files: [
          {
            destination,
            format: 'tailwindFormat'
          }
        ]
      }
    }
  }
}
