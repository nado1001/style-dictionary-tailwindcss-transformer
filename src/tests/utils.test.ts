import { describe, it, expect } from 'vitest'
import {
  addHyphen,
  getConfigValue,
  unquoteFromKeys,
  makeSdObject
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
