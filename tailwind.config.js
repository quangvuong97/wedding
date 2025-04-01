/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    backgroundImage: {
      'clock': "url('../public/images/clock-bg.png')",
    },
    extend: {
      fontFamily: {
        futura: ['"Futura PT"', "sans-serif"],
        muli: ["'Muli'", "sans-serif"],
        'dancing-script': ["'Dancing Script'", "sans-serif"]
      },
      colors: {
        primary: {
          DEFAULT: "#1e8267",
        }
      }
    },
    screens: {
      "xxxs": "370px",
      "xxs": "400px",
      "xs": "450px",
      "ssm": "576px",
      "sm": "767px",
      "md": "992px",
      "lg": "1200px",
      "xl": "1400px",
      "xxl": "1440px",

      // "xs": { max: "1399px" },  // max-width: 575px
      "maxSm": { max: "1200px" },  // max-width: 767px
      "maxMd": { max: "991px" },  // max-width: 991px
      // "lg": { max: "767px" }, // max-width: 1199px
      // "xl": { max: "575px" }, // max-width: 1399px
      "maxSsm": { max: "576px" },
    },
  },
  plugins: [],
}