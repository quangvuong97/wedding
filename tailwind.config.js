/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        futura: ['"Futura PT"', "sans-serif"],
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
      "sm": "768px",
      "md": "992px",
      "lg": "1200px",
      "xl": "1400px",
      "xxl": "1440px",

      "maxXxl": { max: "1439px" },
      "maxXs": { max: "1399px" },
      "maxSm": { max: "1199px" },
      "maxMd": { max: "991px" },
      "maxLg": { max: "767px" },
      "maxSsm": { max: "575px" },
    },
  },
  plugins: [],
}