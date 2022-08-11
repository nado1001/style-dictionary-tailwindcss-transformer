import { camelCase } from 'camel-case'

type ArrayToNestedObjectType = {
  obj: any
  keyPath: string[]
  value: string
}

export const arrayToNestedObject = ({
  obj,
  keyPath,
  value
}: ArrayToNestedObjectType): void => {
  const lastKeyIndex = keyPath.length - 1
  for (let i = 0; i < lastKeyIndex; ++i) {
    const key = camelCase(keyPath[i])
    if (!(key in obj)) {
      obj[key] = {}
    }
    obj = obj[key]
  }
  obj[camelCase(keyPath[lastKeyIndex])] = value
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
