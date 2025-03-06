/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        futura: ['"Futura PT"', "sans-serif"],
        muli: ["'Muli'", "sans-serif"],
        'dancing-script': ["'Dancing Script'", "sans-serif"]
      },
    },
    screens: {
      "xxxs": "370px",
      "xxs": "400px",
      "xs": "450px",
      "sm": "767px",
      "md": "991px",
      "lg": "1199px",
      "xl": "1399px",

      // "xs": { max: "1399px" },  // max-width: 575px
      // "sm": { max: "1199px" },  // max-width: 767px
      // "md": { max: "991px" },  // max-width: 991px
      // "lg": { max: "767px" }, // max-width: 1199px
      // "xl": { max: "575px" }, // max-width: 1399px
    },
  },
  plugins: [],
}