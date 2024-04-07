/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./pages/**/*.{js,ts,jsx,tsx}","./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: {
          gray: {
            light: "var(--tw-colors-base-gray-light)",
            medium: "var(--tw-colors-base-gray-medium)",
            dark: "var(--tw-colors-base-gray-dark)"
          },
          red: "var(--tw-colors-base-red)",
          green: "var(--tw-colors-base-green)"
        },
        font: {
          base: "var(--tw-colors-font-base)",
          secondary: "var(--tw-colors-font-secondary)",
          tertiary: "var(--tw-colors-font-tertiary)"
        }
      },
      fontSize: {
        small: "var(--tw-font-size-small)",
        medium: "var(--tw-font-size-medium)",
        large: "var(--tw-font-size-large)",
        base: "var(--tw-font-size-base)"
      },
      borderRadius: {
        none: "var(--tw-border-radius-none)",
        sm: "var(--tw-border-radius-sm)",
        DEFAULT: "var(--tw-border-radius-default)",
        lg: "var(--tw-border-radius-lg)",
        full: "var(--tw-border-radius-full)"
      }
    },
  },
  plugins: [require("@tailwindcss/typography"),require("@tailwindcss/container-queries")]
}