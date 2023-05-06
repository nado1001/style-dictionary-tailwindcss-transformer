import type { Dictionary, Platform, Config } from 'style-dictionary/types'
import type { Config as TailwindConfig } from 'tailwindcss/types'

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
  tailwind?: Partial<TailwindOptions>
}

export type TailwindFormatObjType = Pick<
  SdTailwindConfigType,
  'type' | 'isVariables' | 'tailwind'
> & {
  dictionary: Dictionary
  formatType: TailwindFormatType
}
