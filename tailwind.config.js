module.exports = {
  mode: "jit",
  purge: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      serif: ["serif"],
    },
    extend: {
      colors: {
        primary: "#BD9B60",
        secondary: "#213F47",
      },
    },
  },
  variants: {
    extend: {
      textOpacity: ["active"],
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
};
