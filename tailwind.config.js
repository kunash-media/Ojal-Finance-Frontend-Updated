// tailwind.config.js
module.exports = {
  darkMode : 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'white': '#FEFEFE',
        'airForceBlue': '#55849E',
        'caramel': '#DE7F3B',
        'white2': '#FFFFFF',
        'amaranth': '#CF3F55',
      },
      dark: {
          800: '#1e1e1e',
          900: '#121212',
        },
    },
  },
  plugins: [],
}