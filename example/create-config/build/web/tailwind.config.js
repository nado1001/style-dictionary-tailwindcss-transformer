
/** @type {import('tailwindcss').Config} */
module.exports = {
mode: "jit",
content: ["./src/**/*.{ts,tsx}"],
darkMode: "class",
theme: {
extend: {
  colors: {
    base: {
      gray: {
        light: "#CCCCCC",
        medium: "#999999",
        dark: "#111111"
      },
      red: "#FF0000",
      green: "#00FF00"
    },
    font: {
      base: "#FF0000",
      secondary: "#00FF00",
      tertiary: "#CCCCCC"
    }
  },
  fontSize: {
    small: "0.75rem",
    medium: "1rem",
    large: "2rem",
    base: "1rem"
  }
},
}
}