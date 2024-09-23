# Style Dictionary Tailwind CSS Transformer

[![Release](https://badgen.net/github/release/nado1001/sd-tailwindcss-transformer)](https://badgen.net/github/release/nado1001/sd-tailwindcss-transformer)
[![Test](https://github.com/nado1001/sd-tailwindcss-transformer/actions/workflows/test.yml/badge.svg)](https://github.com/nado1001/sd-tailwindcss-transformer/actions/workflows/test.yml)
[![Release](https://img.shields.io/npm/dt/sd-tailwindcss-transformer.svg?logo=npm)](https://www.npmjs.com/package/sd-tailwindcss-transformer)

[![Style Dictionary to Tailwind CSS](https://github.com/nado1001/sd-tailwindcss-transformer/blob/main/images/style-dictionary-tailwindcss.png)](https://www.npmjs.com/package/sd-tailwindcss-transformer)

<p align="center">This is a plugin to generate the config of Tailwind CSS using Style Dictionary.<p>

## Install

```bash
$ npm install sd-tailwindcss-transformer
# or with yarn
$ yarn add sd-tailwindcss-transformer
```

## Usage

### Creating configuration file

> [!WARNING]
> If you are using v3 of style-dictionary, install [v1.4.6](https://github.com/nado1001/style-dictionary-tailwindcss-transformer/tree/v1.4.6)

Generate `tailwind.config.js` by setting type to `all`.
See [Creating each theme file](https://github.com/nado1001/sd-tailwindcss-transformer#creating-each-theme-file) if you wish to customize the configuration file with [plugin functions](https://tailwindcss.com/docs/plugins), etc.

```js
import StyleDictionary from 'style-dictionary';
import { makeSdTailwindConfig } from 'sd-tailwindcss-transformer';

const styleDictionaryTailwind = new StyleDictionary(
    makeSdTailwindConfig({ type: 'all' }),
);
await styleDictionaryTailwind.hasInitialized;
await styleDictionaryTailwind.buildAllPlatforms();
```

Output:

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

```js
import StyleDictionary from 'style-dictionary';
import { makeSdTailwindConfig } from 'sd-tailwindcss-transformer';

const types = ['colors', 'fontSize'];

for (const type of types) {
    let tailwindConfig = makeSdTailwindConfig({
        type,
    });

    const styleDictionaryTailwind = new StyleDictionary(tailwindConfig);

    await styleDictionaryTailwind.hasInitialized;
    await styleDictionaryTailwind.buildAllPlatforms();
}
```

Output:

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

### Using CSS custom variables

CSS custom variables can be used by setting isVariables to `true`.
In this case, a CSS file must also be generated.

```js
import StyleDictionary from 'style-dictionary';
import { makeSdTailwindConfig } from 'sd-tailwindcss-transformer';

const sdConfig = makeSdTailwindConfig({
    type: 'all',
    isVariables: true,
});

sdConfig.platforms['css'] = {
    transformGroup: 'css',
    buildPath: './styles/',
    files: [
        {
            destination: 'tailwind.css',
            format: 'css/variables',
            options: {
                outputReferences: true,
            },
        },
    ],
};

const styleDictionaryTailwind = new StyleDictionary(
    makeSdTailwindConfig({ type: 'all' }),
);
await styleDictionaryTailwind.hasInitialized;
await styleDictionaryTailwind.buildAllPlatforms();
```

Output:

```css
/* tailwind.css */
/**
 * Do not edit directly
 * Generated on ○○○○
 */

:root {
  --font-size-medium: 1rem;
  --font-size-small: 0.75rem;
  --colors-base-red: #ff0000;
  --colors-base-gray: #111111;
  ...;
}
```

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
          gray: "var(--colors-base-gray)",
          red: "var(--colors-base-red)",
          ...
        }
      },
      fontSize: {
        small: "var(--font-size-small)",
        medium: "var(--font-size-medium)",
        ...
      }
    },
  }
}
```

Please see [Example](https://github.com/nado1001/sd-tailwindcss-transformer/tree/main/example) for details.

### Options

Optional except for `type`.

| Attribute         | Description                                                                                                                                                                            | Type                                                                                                                                   |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| type              | Set the name of each theme (colors, fontSize, etc.) for `'all'` or tailwind.                                                                                                           | `'all'` or string                                                                                                                      |
| formatType        | Set the format of the Tailwind CSS configuration file. <br>Default value: `js`                                                                                                         | `'js'` `'cjs'`                                                                                                                         |
| isVariables       | Set when using CSS custom variables. <br>Default value: `false`                                                                                                                        | boolean                                                                                                                                |
| extend            | Set to add transformed styles to the `'extend'` key within the `'theme'` key or not. <br>Default value: `true`                                                                         | boolean                                                                                                                                |
| source            | [`source`](https://github.com/amzn/style-dictionary/blob/main/README.md#configjson) attribute of style-dictionary.<br>Default value: `['tokens/**/*.json']`                            | Array of strings                                                                                                                       |
| transforms        | [`platform.transforms`](https://github.com/amzn/style-dictionary/blob/main/README.md#configjson) attribute of style-dictionary.<br>Default value: `['attribute/cti','name/cti/kebab']` | Array of strings                                                                                                                       |
| buildPath         | [`platform.buildPath`](https://github.com/amzn/style-dictionary/blob/main/README.md#configjson) attribute of style-dictionary.<br>Default value: `'build/web/'`                        | string                                                                                                                                 |
| prefix            | [`platform.prefix`](https://github.com/amzn/style-dictionary/blob/main/types/Platform.d.ts#L21) attribute of style-dictionary.<br>Valid when using css variables (isVariables: true)   | string                                                                                                                                 |
| tailwind.content  | [Content](https://tailwindcss.com/docs/content-configuration) attribute of Tailwind CSS. Set if necessary when 'all' is set in type. <br>Default value: `['./src/**/*.{ts,tsx}']`      | Array of strings                                                                                                                       |
| tailwind.darkMode | [Dark Mode](https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually) attribute of Tailwind CSS. Set if necessary when 'all' is set in type. <br>Default value: `'class'`    | `'media'` `'class'`                                                                                                                    |
| tailwind.plugin   | Tailwind CSS [official plugins](https://tailwindcss.com/docs/plugins#official-plugins). Set if necessary when 'all' is set in type.                                                    | Array of `'typography'` `['typography', options]` `'forms'` `['forms', options]` `'aspect-ratio'` `'line-clamp'` `'container-queries'` |

## License

[Apache 2.0](https://github.com/nado1001/sd-tailwindcss-transformer/blob/main/license)
