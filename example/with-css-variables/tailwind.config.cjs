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
            light: "var(--colors-base-gray-light)",
            medium: "var(--colors-base-gray-medium)",
            dark: "var(--colors-base-gray-dark)"
          },
          red: "var(--colors-base-red)",
          green: "var(--colors-base-green)"
        },
        font: {
          base: "var(--colors-font-base)",
          secondary: "var(--colors-font-secondary)",
          tertiary: "var(--colors-font-tertiary)"
        }
      },
      fontSize: {
        small: "var(--font-size-small)",
        medium: "var(--font-size-medium)",
        large: "var(--font-size-large)",
        base: "var(--font-size-base)"
      }
    },
  },
 plugins: [require("@tailwindcss/typography"),require("@tailwindcss/container-queries")]
}