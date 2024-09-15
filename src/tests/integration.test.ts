import { describe, it, expect } from 'vitest'
import StyleDictionary from 'style-dictionary'
import { makeSdTailwindConfig } from '../'

const expectedOutputForAllType = `/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        red: {
          500: "#FF0000"
        }
      }
    },
  },
}`

const expectedOutputForColors = `module.exports = {
  red: {
    500: "#FF0000"
  }
}`

describe('Should work with StyleDictionary properly', () => {
  it('build all tokens', async () => {
    const styleDictionaryTailwind = new StyleDictionary(
      makeSdTailwindConfig({ type: 'all', source: ['src/tests/tokens.json'] })
    )
    await styleDictionaryTailwind.hasInitialized
    const formatted = await styleDictionaryTailwind.formatAllPlatforms()
    expect(formatted['tailwind'][0]['output']).toEqual(expectedOutputForAllType)
  })

  it('build colors', async () => {
    const types = ['colors']

    for (const type of types) {
      const tailwindConfig = makeSdTailwindConfig({
        type,
        source: ['src/tests/tokens.json']
      })

      const styleDictionaryTailwind = new StyleDictionary(tailwindConfig)

      await styleDictionaryTailwind.hasInitialized
      const formatted = await styleDictionaryTailwind.formatAllPlatforms()

      expect(formatted['tailwind/colors'][0]['output']).toEqual(
        expectedOutputForColors
      )
    }
  })
})
