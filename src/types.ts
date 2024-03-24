import type { Dictionary } from 'style-dictionary/types/Dictionary'
import type { Platform } from 'style-dictionary/types/Platform'
import type { Config } from 'style-dictionary/types/Config'
import type { Config as TailwindConfig } from 'tailwindcss/types'

export type SdObjType<T extends Record<string, any>> = {
  [P in keyof T]: Record<P, SdObjType<T>> | T[P]
}

export type TailwindOptions = Pick<TailwindConfig, 'content' | 'darkMode'> & {
  plugins: Array<
    'typography' | 'forms' | 'aspect-ratio' | 'line-clamp' | 'container-queries'
  >
}
export type TailwindFormatType = 'js' | 'cjs'

export type SdTailwindConfigType = {
  type: 'all' | string
  formatType?: TailwindFormatType
  isVariables?: boolean
  source?: Config['source']
  transforms?: Platform['transforms']
  buildPath?: Platform['buildPath']
  prefix?: Platform['prefix']
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