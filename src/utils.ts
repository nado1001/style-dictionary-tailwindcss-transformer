import { camelCase } from 'camel-case'

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

export const getConfigValue = <T>(value: T | undefined, defaultValue: T) =>
  value !== undefined ? value : defaultValue

const joinSpace = (value: string, type?: string) => {
  if (type !== 'all') {
    return value
  }
  return `\t\t${value}`
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
