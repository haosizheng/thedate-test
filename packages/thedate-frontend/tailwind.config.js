module.exports = {
  mode: 'jit',
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}', 
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  plugins: [
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      "neutral": "#1A1A1A",
      "neutral-base": "#FFFFFF",
      "neutral-content": "#8e8e8e",
      "neutral-focus": "#cbcbcb",
    },
    extend: {
      width: {
        '120': '30rem',
        '160': '40rem',
      },
      height: {
        '120': '30rem',
        '160': '40rem',
      },
      maxHeight: {
        '120': '30rem',
        '160': '40rem',
      },
      fontFamily: {
        serif: ['EB Garamond', 'serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
    },
  },
  variants: {
    extend: {
      borderStyle: ['hover', 'focus'],
    }
  },
}
