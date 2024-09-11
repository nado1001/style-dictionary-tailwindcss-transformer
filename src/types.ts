import { Dictionary } from 'style-dictionary/types/DesignToken'
import type { Config, PlatformConfig } from 'style-dictionary/types/Config'
import type { Config as TailwindConfig } from 'tailwindcss/types'

export type SdObjType<T extends Record<string, any>> = {
  [P in keyof T]: Record<P, SdObjType<T>> | T[P]
}

export type TailwindOptions = Pick<TailwindConfig, 'content' | 'darkMode'> & {
  plugins: Array<
    | 'typography'
    | ['typography', { className?: string; target?: 'modern' | 'legacy' }]
    | 'forms'
    | ['forms', { strategy?: 'base' | 'class' }]
    | 'aspect-ratio'
    | 'line-clamp'
    | 'container-queries'
  >
}
export type TailwindFormatType = 'js' | 'cjs'

export type SdTailwindConfigType = {
  type: 'all' | string
  formatType?: TailwindFormatType
  isVariables?: boolean
  source?: Config['source']
  preprocessors?: Config['preprocessors']
  transforms?: PlatformConfig['transforms']
  buildPath?: PlatformConfig['buildPath']
  prefix?: PlatformConfig['prefix']
  tailwind?: Partial<TailwindOptions>
  extend?: boolean
}

export type TailwindFormatObjType = Pick<
  SdTailwindConfigType,
  'type' | 'isVariables' | 'prefix' | 'tailwind' | 'extend'
> & {
  dictionary: Dictionary
  formatType: TailwindFormatType
}
