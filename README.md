# sd-tailwindcss-transformer
[![Testing](https://github.com/nado1001/sd-tailwindcss-transformer/actions/workflows/test.yml/badge.svg)](https://github.com/nado1001/sd-tailwindcss-transformer/actions/workflows/test.yml)  
This is a plugin to generate the config of Tailwind CSS using Style Dictionary.

## Install
```bash
$ npm install sd-tailwindcss-transformer
# or with yarn
$ yarn add sd-tailwindcss-transformer
```

## Usage

### Creating each property file 
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

Output file:  

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
### Creating configuration file

```ts
const StyleDictionaryModule = require('style-dictionary')
const { sdTailwindConfig } = require('sd-tailwindcss-transformer')

const StyleDictionary = StyleDictionaryModule.extend(
  sdTailwindConfig({ type: 'all' })
)

StyleDictionary.buildAllPlatforms()
```

Output file:  

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

Please see [Example](https://github.com/nado1001/sd-tailwindcss-transformer/tree/main/example) for details

## License
[Apache 2.0](https://github.com/nado1001/sd-tailwindcss-transformer/blob/main/license)
