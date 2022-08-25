import { test, expect } from 'vitest'
import { getConfigValue, unquoteFromKeys, makeNestedObject } from '../utils'

test('getConfigValue', () => {
  expect(getConfigValue('value', 'default')).toEqual('value')
  expect(getConfigValue(undefined, 2)).toEqual(2)
})

test('unquoteFromKeys', () => {
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

test('makeNestedObject', () => {
  const obj: { [key: string]: string } = {
    'hoge.foo': 'bar',
    'hoge.fuga': 'baz'
  }

  const result = {}
  Object.keys(obj).forEach((key) => {
    const keys = key.split('.').filter((k) => k !== 'colors')
    makeNestedObject(result, keys, obj[key])
  })

  expect(result).toEqual({
    hoge: {
      foo: 'bar',
      fuga: 'baz'
    }
  })
})
