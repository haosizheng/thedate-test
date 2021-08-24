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
    extend: {},
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
          "primary": "#ff7598",
          "primary-focus": "#ff5784",
          "primary-content": "#000000",
          "secondary": "#75d1f0",
          "secondary-focus": "#5abfdd",
          "secondary-content": "#000000",
          "accent": "#c07eec",
          "accent-focus": "#af59e8",
          "accent-content": "#ffffff",
          "neutral": "#E5E5E5",
          "neutral-focus": "#090901",
          "neutral-content": "#000000",
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
