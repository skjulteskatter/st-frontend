module.exports = {
  purge: [
    './src/**/*.vue',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      serif: ['serif'],
    },
    extend: {
      colors: {
        primary: '#BD9B60',
        secondary: '#213F47',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
