# sd-tailwindcss-transformer

[![Release](https://badgen.net/github/release/nado1001/sd-tailwindcss-transformer)](https://badgen.net/github/release/nado1001/sd-tailwindcss-transformer)
[![Test](https://github.com/nado1001/sd-tailwindcss-transformer/actions/workflows/test.yml/badge.svg)](https://github.com/nado1001/sd-tailwindcss-transformer/actions/workflows/test.yml)  
This is a plugin to generate the config of Tailwind CSS using Style Dictionary.

## Install

```bash
$ npm install sd-tailwindcss-transformer
# or with yarn
$ yarn add sd-tailwindcss-transformer
```

## Usage

### Creating configuration file

Use when you don't need to customize the configuration file much.  
If you need more detailed customization, please see [Creating each theme file](https://github.com/nado1001/sd-tailwindcss-transformer#creating-each-theme-file).  
example:

```ts
const StyleDictionaryModule = require('style-dictionary')
const { sdTailwindConfig } = require('sd-tailwindcss-transformer')

const StyleDictionary = StyleDictionaryModule.extend(
  sdTailwindConfig({ type: 'all' })
)

StyleDictionary.buildAllPlatforms()
```

The following files will be generated when the build is executed:

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: {
          gray: "#111111",
          red: "#FF0000",
          ...
        }
      },
      fontSize: {
        small: "0.75rem",
        medium: "1rem",
        ...
      }
    },
  }
}
```

### Creating each [theme](https://tailwindcss.com/docs/configuration#theme) file

Create an object for each theme, assuming that various customizations will be made in the configuration file.  
Import and use the created files in `tailwind.config.js`.  
example:

```ts
const StyleDictionaryModule = require('style-dictionary')
const { sdTailwindConfig } = require('sd-tailwindcss-transformer')

const types = ['colors', 'fontSize']

types.map((type) => {
  const StyleDictionary = StyleDictionaryModule.extend(
    sdTailwindConfig({ type })
  )

  StyleDictionary.buildAllPlatforms()
})
```

The following files will be generated when the build is executed:

```js
/// colors.tailwind.js
module.exports = {
  base: {
    gray: "#111111",
    red: "#FF0000",
    ...
  }
}
```

```js
/// fontSize.tailwind.js
module.exports = {
  small: "0.75rem",
  medium: "1rem",
  ...
}
```

Please see [Example](https://github.com/nado1001/sd-tailwindcss-transformer/tree/main/example) for details.

### Options

| Attribute         | Description                                                                                                                                                                            | Type                |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| type              | Set the name of each theme (colors, fontSize, etc.) for `'all'` or tailwind.                                                                                                           | `'all'` or string   |
| source            | [`source`](https://github.com/amzn/style-dictionary/blob/main/README.md#configjson) attribute of style-dictionary.<br>Default value: ` ['tokens/**/*.json']`                           | Array of strings    |
| transforms        | [`platform.transforms`](https://github.com/amzn/style-dictionary/blob/main/README.md#configjson) attribute of style-dictionary.<br>Default value: `['attribute/cti','name/cti/kebab']` | Array of strings    |
| buildPath         | [`platform.buildPath`](https://github.com/amzn/style-dictionary/blob/main/README.md#configjson) attribute of style-dictionary.<br>Default value: `'build/web/'`                        | string              |
| tailwind.content  | [Content](https://tailwindcss.com/docs/content-configuration) attribute of tailwind css. Set if necessary when 'all' is set in type. <br>Default value: `['./src/**/*.{ts,tsx}']`      | Array of strings    |
| tailwind.darkMode | [Dark Mode](https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually) attribute of tailwind css. Set if necessary when 'all' is set in type. <br>Default value: `'class'`    | `'media'` `'class'` |

## License

[Apache 2.0](https://github.com/nado1001/sd-tailwindcss-transformer/blob/main/license)
