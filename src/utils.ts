//utils.ts
import { camelCase } from 'change-case'
import type { SdObjType, SdTailwindConfigType, TailwindOptions } from './types'

export const addHyphen = (str: string) => {
  return str.endsWith('-') ? str : `${str}-`
}

export const makeSdObject = <T extends readonly string[]>(
  obj: SdObjType<{ [key: string]: any }>,
  keys: T,
  value: string
): void => {
  const lastIndex = keys.length - 1
  for (let i = 0; i < lastIndex; ++i) {
    const key = camelCase(keys[i])
    if (!(key in obj)) {
      obj[key] = {}
    }
    obj = obj[key]
  }

  // https://v2.tailwindcss.com/docs/upgrading-to-v2#update-default-theme-keys-to-default
  if (keys[lastIndex] === 'DEFAULT') {
    obj[keys[lastIndex]] = value
  } else {
    obj[camelCase(keys[lastIndex])] = value
  }
}

export const getConfigValue = <T>(value: T | undefined, defaultValue: T) => {
  if (value === undefined) {
    return defaultValue
  }

  return value
}

const joinSpace = (value: string, type?: string, space = ' '.repeat(4)) => {
  if (type !== 'all') {
    return value
  }
  return space + value
}

export const unquoteFromKeys = (json: string, type?: string) => {
  const result = json.replace(/"(\\[^]|[^\\"])*"\s*:?/g, (match) => {
    if (/[0-9]/.test(match) && /[a-zA-Z]/.test(match)) {
      return match
    }
    if (/:$/.test(match)) {
      return joinSpace(match.replace(/^"|"(?=\s*:$)/g, ''), type)
    }

    return match
  })

  return result.replace(/}/g, (match) => joinSpace(match, type))
}

export const getTemplateConfigByType = (
  type: SdTailwindConfigType['type'],
  content: string,
  darkMode: TailwindOptions['darkMode'],
  tailwindContent: TailwindOptions['content'],
  extend: SdTailwindConfigType['extend'],
  plugins: string[]
) => {
  const extendTheme = extend ? 
  `theme: { extend: ${unquoteFromKeys(content, type)}, },` : 
  `theme: ${unquoteFromKeys(content, type)},`

  const getTemplateConfig = () => {
    let config = `{
  mode: "jit",
  content: [${tailwindContent}],
  darkMode: "${darkMode}",
  ${extendTheme}`

    if (plugins.length > 0) {
      config += `\n plugins: [${plugins}]`
    }

    config += '\n}'

    return config
  }

  const configs = `/** @type {import('tailwindcss').Config} */\n module.exports = ${getTemplateConfig()}`

  return configs
}