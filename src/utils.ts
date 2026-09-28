import { camelCase, kebabCase } from 'change-case'
import type {
  CssThemeEntry,
  SdObjType,
  SdTailwindConfigType,
  TailwindOptions
} from './types'

export const addHyphen = (str: string) => {
  return str.endsWith('-') ? str : `${str}-`
}

export const makeSdObject = <T extends readonly string[]>(
  obj: SdObjType<{ [key: string]: any }>,
  keys: T,
  value: string,
  setCasing = true
): void => {
  const lastIndex = keys.length - 1
  for (let i = 0; i < lastIndex; ++i) {
    let key = keys[i];

    if (setCasing) {
      key = camelCase(keys[i]);
    }

    if (!(key in obj)) {
      obj[key] = {}
    }
    obj = obj[key]
  }

  // https://v2.tailwindcss.com/docs/upgrading-to-v2#update-default-theme-keys-to-default
  if (keys[lastIndex] === 'DEFAULT') {
    setCasing = false;
  }

  if (!setCasing) {
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

const joinSpace = (value: string, spaceNum: number, type?: string) => {
  const space = ' '.repeat(spaceNum)

  if (type !== 'all') {
    return value
  }

  return space + value
}

export const unquoteFromKeys = (json: string, type?: string, spaceNum = 4) => {
  const result = json.replace(/"(\\[^]|[^\\"])*"\s*:?/g, (match) => {
    if (/[0-9]/.test(match) && /[a-zA-Z]/.test(match)) {
      return match
    }
    if (/:$/.test(match)) {
      return joinSpace(match.replace(/^"|"(?=\s*:$)/g, ''), spaceNum, type)
    }

    return match
  })

  return result.replace(/}/g, (match) => joinSpace(match, spaceNum, type))
}

export const getTemplateConfigByType = (
  type: SdTailwindConfigType['type'],
  content: string,
  darkMode: TailwindOptions['darkMode'],
  tailwindContent: TailwindOptions['content'],
  extend: SdTailwindConfigType['extend'],
  plugins: string[]
) => {
  const extendTheme = extend
    ? `theme: {
    extend: ${unquoteFromKeys(content, type, 4)},
  },`
    : `theme: ${unquoteFromKeys(content, type, 2)},`

  const getTemplateConfig = () => {
    let config = `{
  content: [${tailwindContent}],
  darkMode: "${darkMode}",
  ${extendTheme}`

    if (plugins.length > 0) {
      config += `\n  plugins: [${plugins}]`
    }

    config += '\n}'

    return config
  }

  const configs = `/** @type {import('tailwindcss').Config} */\nmodule.exports = ${getTemplateConfig()}`

  return configs
}

/**
 * Maps a Style Dictionary token category (v3-style Tailwind theme key) to the
 * corresponding Tailwind CSS v4 `@theme` namespace.
 *
 * @see https://tailwindcss.com/docs/theme#theme-variable-namespaces
 */
export const V4_THEME_NAMESPACE: Record<string, string> = {
  colors: 'color',
  color: 'color',
  fontFamily: 'font',
  fontSize: 'text',
  fontWeight: 'font-weight',
  letterSpacing: 'tracking',
  lineHeight: 'leading',
  screens: 'breakpoint',
  spacing: 'spacing',
  borderRadius: 'radius',
  boxShadow: 'shadow',
  dropShadow: 'drop-shadow',
  blur: 'blur',
  transitionTimingFunction: 'ease',
  aspectRatio: 'aspect',
  animation: 'animate',
  container: 'container'
}

/**
 * Resolves the Tailwind v4 `@theme` namespace for a token category.
 * Unknown categories fall back to their kebab-cased name so custom tokens are
 * still emitted (though Tailwind will not generate utilities for unknown
 * namespaces).
 */
export const getV4ThemeNamespace = (category: string) => {
  return V4_THEME_NAMESPACE[category] ?? kebabCase(category)
}

/**
 * Builds the flat `--namespace-*` CSS custom property name for a token path.
 * The leading category segment is replaced by its v4 namespace and a trailing
 * `DEFAULT` segment is dropped (so it maps to the bare `--namespace`).
 */
export const getCssVariableName = (path: string[]) => {
  const [category, ...rest] = path
  const namespace = getV4ThemeNamespace(category)
  const suffix = rest
    .filter((segment) => segment !== 'DEFAULT')
    .map((segment) => kebabCase(segment))

  return suffix.length > 0
    ? `--${namespace}-${suffix.join('-')}`
    : `--${namespace}`
}

/**
 * Renders a Tailwind CSS v4 CSS-first configuration file.
 *
 * When `full` is true (type `all`) the output is a self-contained stylesheet
 * with `@import`, `@plugin`, dark mode `@custom-variant` and the `@theme`
 * block. Otherwise only the `@theme` block is emitted so it can be composed
 * into an existing stylesheet.
 */
export const getTemplateCssConfig = (
  themeEntries: CssThemeEntry[],
  darkMode: TailwindOptions['darkMode'],
  plugins: string[],
  prefix: string | undefined,
  full: boolean
) => {
  const theme = [
    '@theme {',
    ...themeEntries.map(({ name, value }) => `  ${name}: ${value};`),
    '}'
  ].join('\n')

  if (!full) {
    return `${theme}\n`
  }

  const blocks: string[] = []

  blocks.push(
    prefix ? `@import "tailwindcss" prefix(${prefix});` : `@import "tailwindcss";`
  )

  if (plugins.length > 0) {
    blocks.push(plugins.map((plugin) => `@plugin "${plugin}";`).join('\n'))
  }

  // Tailwind v4 defaults the `dark:` variant to `prefers-color-scheme`.
  // Recreate the v3 `class`/`selector` behaviour with a custom variant.
  if (darkMode === 'class' || darkMode === 'selector') {
    blocks.push('@custom-variant dark (&:where(.dark, .dark *));')
  }

  blocks.push(theme)

  return `${blocks.join('\n\n')}\n`
}
