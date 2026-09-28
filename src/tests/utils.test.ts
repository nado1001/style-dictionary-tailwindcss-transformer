import { describe, it, expect } from 'vitest'
import {
  addHyphen,
  getConfigValue,
  unquoteFromKeys,
  makeSdObject,
  getV4ThemeNamespace,
  getCssVariableName,
  getTemplateCssConfig
} from '../utils'

describe('addHyphen function', () => {
  it('should add hyphen if the string does not end with hyphen', () => {
    expect(addHyphen('hoge')).toEqual('hoge-')
  })

  it('should not add hyphen if the string ends with hyphen', () => {
    expect(addHyphen('hoge-')).toEqual('hoge-')
  })
})

describe('getConfigValue function', () => {
  it('should return T if T is passed', () => {
    expect(getConfigValue('value', 'default')).toEqual('value')
  })

  it('should return defaultValue if T is undefined', () => {
    expect(getConfigValue(undefined, 2)).toEqual(2)
  })
})

describe('unquoteFromKeys function', () => {
  it('should not remove double quotes if the key is only numbers', () => {
    const obj = {
      colors: {
        base: {
          gray: {
            light: '#CCCCCC'
          },
          red: '#FF0000',
          '10x': '#00FF00'
        }
      }
    }
    const json = JSON.stringify(obj, null, 2)

    expect(unquoteFromKeys(json)).toEqual(`{
  colors: {
    base: {
      gray: {
        light: "#CCCCCC"
      },
      red: "#FF0000",
      "10x": "#00FF00"
    }
  }
}`)
  })
})

describe('makeSdObject function', () => {
  it('should return a nested object if the key is comma-separated', () => {
    const obj: { [key: string]: string } = {
      'hoge.foo': 'bar',
      'hoge.fuga': 'baz'
    }

    const result = {}
    Object.keys(obj).forEach((key) => {
      const keys = key.split('.').filter((k) => k !== 'colors')
      makeSdObject(result, keys, obj[key])
    })

    expect(result).toEqual({
      hoge: {
        foo: 'bar',
        fuga: 'baz'
      }
    })
  })

  it('should camelCase values when setCasing is not given', () => {
    const obj: { [key: string]: string } = {
      'foo.foo-bar': 'bar',
    }

    const result = {}
    Object.keys(obj).forEach((key) => {
      const keys = key.split('.').filter((k) => k !== 'colors')
      makeSdObject(result, keys, obj[key])
    })

    expect(result).toEqual({
      foo: {
        fooBar: 'bar'
      }
    })
  })

  it('should not camelCase when setCasing is set to false', () => {
    const obj: { [key: string]: string } = {
      'typography.foo-bar': 'bar',
    }

    const result = {}
    Object.keys(obj).forEach((key) => {
      const keys = key.split('.').filter((k) => k !== 'colors')
      makeSdObject(result, keys, obj[key], false)
    })

    expect(result).toEqual({
      typography: {
        'foo-bar': 'bar'
      }
    })
  })
})

describe('getV4ThemeNamespace function', () => {
  it('should map known v3 theme keys to v4 namespaces', () => {
    expect(getV4ThemeNamespace('colors')).toEqual('color')
    expect(getV4ThemeNamespace('fontSize')).toEqual('text')
    expect(getV4ThemeNamespace('borderRadius')).toEqual('radius')
    expect(getV4ThemeNamespace('screens')).toEqual('breakpoint')
  })

  it('should fall back to kebab-cased name for unknown categories', () => {
    expect(getV4ThemeNamespace('customThing')).toEqual('custom-thing')
  })
})

describe('getCssVariableName function', () => {
  it('should build a namespaced flat variable name from a token path', () => {
    expect(getCssVariableName(['colors', 'base', 'gray', 'light'])).toEqual(
      '--color-base-gray-light'
    )
    expect(getCssVariableName(['fontSize', 'small'])).toEqual('--text-small')
  })

  it('should drop a trailing DEFAULT segment', () => {
    expect(getCssVariableName(['borderRadius', 'DEFAULT'])).toEqual('--radius')
  })
})

describe('getTemplateCssConfig function', () => {
  const entries = [
    { name: '--color-base-red', value: '#FF0000' },
    { name: '--text-small', value: '0.75rem' }
  ]

  it('should render a self-contained stylesheet when full is true', () => {
    const result = getTemplateCssConfig(
      entries,
      'class',
      ['@tailwindcss/typography'],
      undefined,
      true
    )

    expect(result).toEqual(`@import "tailwindcss";

@plugin "@tailwindcss/typography";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-base-red: #FF0000;
  --text-small: 0.75rem;
}
`)
  })

  it('should emit a prefixed import when a prefix is given', () => {
    const result = getTemplateCssConfig(entries, 'media', [], 'tw', true)

    expect(result).toEqual(`@import "tailwindcss" prefix(tw);

@theme {
  --color-base-red: #FF0000;
  --text-small: 0.75rem;
}
`)
  })

  it('should emit only the @theme block when full is false', () => {
    const result = getTemplateCssConfig(entries, 'class', [], undefined, false)

    expect(result).toEqual(`@theme {
  --color-base-red: #FF0000;
  --text-small: 0.75rem;
}
`)
  })
})
