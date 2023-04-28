import type { Dictionary, Config } from 'style-dictionary/types'
import type { SdTailwindConfigType, TailwindFormatObjType } from './types'
import {
  getConfigValue,
  makeNestedObject,
  unquoteFromKeys,
  getTemplateConfigByType
} from './utils'
import { format } from 'prettier'

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
  formatType,
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

    const configs = getTemplateConfigByType(
      type,
      formatType,
      content,
      darkMode,
      tailwindContent,
      plugins
    )

    console.log(configs)

    return format(configs, { parser: 'babel', semi: false })
  } else {
    return format(`module.exports = ${unquoteFromKeys(content)}`, {
      parser: 'babel'
    })
  }
}

export const makeSdTailwindConfig = ({
  type,
  formatType = 'js',
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
        return getTailwindFormat({
          dictionary,
          formatType,
          isVariables,
          type,
          tailwind
        })
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
              type !== 'all'
                ? `${type}.tailwind.js`
                : `tailwind.config.${formatType}`,
            format: 'tailwindFormat'
          }
        ]
      }
    }
  }
}
