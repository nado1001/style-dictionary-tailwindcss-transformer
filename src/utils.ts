import { camelCase } from 'camel-case'
import type { SdTailwindConfigType, TailwindOptions } from './types'

type NestedObj<T extends Record<string, any>> = {
  [P in keyof T]: Record<P, NestedObj<T>> | T[P]
}

export const makeNestedObject = <T extends readonly string[]>(
  obj: NestedObj<{ [key: string]: any }>,
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
  obj[camelCase(keys[lastIndex])] = value
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
  plugins: string[]
) => {
  const getTemplateConfig = () => {
    let config = `{mode: "jit",content: [${tailwindContent}],darkMode: "${darkMode}",theme: {extend: ${unquoteFromKeys(
      content,
      type
    )},},`

    if (plugins.length > 0) {
      config += `\n plugins: [${plugins}]`
    }

    config += '\n}'

    return config
  }

  const configs = `/** @type {import('tailwindcss').Config} */\n module.exports = ${getTemplateConfig()}`

  return configs
}
