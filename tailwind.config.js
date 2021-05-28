module.exports = {
  mode: 'jit',
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
        primary: 'var(--st-primary)',
        secondary: 'var(--st-secondary)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
