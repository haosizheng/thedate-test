module.exports = {
  mode: 'jit',
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}', 
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  plugins: [
    require('daisyui')
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      height: {
        '120': '30rem',
        '160': '40rem',
      },
      maxHeight: {
        '120': '30rem',
        '160': '40rem',
      },
      fontFamily: {
        mono: 'Roboto Mono',
      },
    },
  },
  variants: {
    extend: {
      borderStyle: ['hover', 'focus'],
    }
  },
  daisyui: {
    styled: true,
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    themes: [
      {
        'mytheme': {                          /* your theme name */
          "primary": "#000000",
          "primary-focus": "#000000",
          "primary-content": "#000000",
          "secondary": "#000000",
          "secondary-focus": "#000000",
          "secondary-content": "#000000",
          "accent": "#454545",
          "accent-focus": "#454545",
          "accent-content": "#ffffff",
          "neutral": "#111111",
          "neutral-focus": "#090901",
          "neutral-content": "#E5E5E5",
          "base-100": "##ffffff",
          "base-200": "#f9fafb",
          "base-300": "#d1d5db",
          "base-content": "#1f2937",
          "info": "#2094f3",
          "success": "#009485",
          "warning": "#ff9900",
          "error": "#ff5724",
          "--rounded-box": "0",
          "--rounded-btn": "0",
          "--rounded-badge": "0",
          "--tab-radius": "0"
        },
      },
    ],
  }
}
