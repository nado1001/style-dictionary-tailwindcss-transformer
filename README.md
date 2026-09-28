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
# or with pnpm
$ pnpm add sd-tailwindcss-transformer
```

## Usage

### Creating configuration file

> [!WARNING]
> If you are using v4 of style-dictionary, install [v2.1.0](https://github.com/nado1001/style-dictionary-tailwindcss-transformer/releases/tag/v2.1.0)

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

### Tailwind CSS v4 (CSS-first)

Tailwind CSS v4 moved to a [CSS-first configuration](https://tailwindcss.com/docs/theme) model based on the `@theme` directive and CSS custom properties, instead of a `tailwind.config.js` file.

Set `formatType` to `'css'` to generate a v4-native stylesheet. Token categories are mapped to the corresponding v4 [theme namespaces](https://tailwindcss.com/docs/theme#theme-variable-namespaces) (`colors` → `--color-*`, `fontSize` → `--text-*`, `borderRadius` → `--radius-*`, `screens` → `--breakpoint-*`, etc.), so utilities such as `bg-*` / `text-*` are generated automatically. Unknown categories fall back to their kebab-cased name.

```js
import StyleDictionary from 'style-dictionary';
import { makeSdTailwindConfig } from 'sd-tailwindcss-transformer';

const styleDictionaryTailwind = new StyleDictionary(
    makeSdTailwindConfig({
        type: 'all',
        formatType: 'css',
        tailwind: {
            darkMode: 'class',
            plugins: ['typography', 'container-queries'],
        },
    }),
);
await styleDictionaryTailwind.hasInitialized;
await styleDictionaryTailwind.buildAllPlatforms();
```

Output:

```css
/* tailwind.css */
@import "tailwindcss";

@plugin "@tailwindcss/typography";
@plugin "@tailwindcss/container-queries";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-base-gray-light: #CCCCCC;
  --color-base-red: #FF0000;
  --text-small: 0.75rem;
  --text-medium: 1rem;
  --radius-sm: .125rem;
  --radius: 1rem;
  ...
}
```

Notes:

- `@import "tailwindcss";` / `@plugin "..."` / the dark-mode `@custom-variant` are only emitted when `type` is `'all'`. For a single theme (`type: 'colors'`, etc.) only the `@theme { ... }` block is generated so it can be composed into an existing stylesheet.
- In v4 the `@theme` block is the single source of truth for both the CSS variables and the theme registration, so `isVariables` is not needed with `formatType: 'css'`.
- `content` is omitted because v4 detects template files automatically. `darkMode: 'class'` (or `'selector'`) is translated to a `@custom-variant dark (...)`; `darkMode: 'media'` uses the v4 default and emits no variant.
- When `prefix` is set, the import becomes `@import "tailwindcss" prefix(<prefix>);`.
- The existing `js` / `cjs` output is kept unchanged as a `@config`-compatible path for backward compatibility.

See the [with-tailwind-v4 example](https://github.com/nado1001/sd-tailwindcss-transformer/tree/main/example/with-tailwind-v4) for a full setup.

### Options

Optional except for `type`.

| Attribute         | Description                                                                                                                                                                            | Type                                                                                                                                   |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| type              | Set the name of each theme (colors, fontSize, etc.) for `'all'` or tailwind.                                                                                                           | `'all'` or string                                                                                                                      |
| formatType        | Set the format of the Tailwind CSS configuration file. `css` outputs a Tailwind v4 CSS-first stylesheet (`@theme`). <br>Default value: `js`                                             | `'js'` `'cjs'` `'css'`                                                                                                                 |
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
