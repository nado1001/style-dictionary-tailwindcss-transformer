import { test, expect } from 'vitest'
import { getConfigValue } from '../utils'

test('getConfigValue', () => {
  expect(getConfigValue('value', 'default')).toEqual('value')
  expect(getConfigValue(undefined, 2)).toBe(2)
})
