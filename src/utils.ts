import { camelCase } from 'camel-case'

export const arrayToNestedObject = <T extends readonly string[]>(
  obj: any,
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

export const unquoteFromKeys = (json: string) => {
  return json.replace(/"(\\[^]|[^\\"])*"\s*:?/g, (match: string) => {
    if (/[0-9]/.test(match) && /[a-zA-Z]/.test(match)) {
      return match
    } else if (/:$/.test(match)) {
      return match.replace(/^"|"(?=\s*:$)/g, '')
    } else return match
  })
}

export const getConfigValue = <T>(value: T | undefined, defaultValue: T) =>
  value !== undefined ? value : defaultValue
