const colors = require('./build/web/colors.tailwind')
const fontSize = require('./build/web/fontSize.tailwind')

module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors,
      fontSize
    }
  }
}
