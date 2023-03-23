/** @type {import('tailwindcss').Config} */
const themes = require("./Themes/index");
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  important: true, // important in prod is must be
  theme: ["dark"],


  theme: {

    extend: {
      fontFamily: {
        jetbrains: 'JetBrains-Mono-Thin'
      }
    }
  },

  // theme: {
  //   colors: {
  //     'white': '#FFFFFF',
  //     'boring-white': '#FDFDFD',
  //     'gray-lightest': '#EEE',
  //     'gray-lighter': '#CCC',
  //     'gray-light': '#999',
  //     'gray': '#666',
  //     'gray-dark': '#444',
  //     'gray-darker': '#333',
  //     'gray-darkest': '#222',
  //     // 'boring-black': '#1A1B1E',
  //     'boring-black': '#1A1B1E',
  //     'black': '#000000',
  //     'boring-orange': '#e94d17',
  //     'boring-red': '#FF382A',
  //     'boring-green': '#85D680',
  //     'boring-blue': '#5AB0E2',
  //     'boring-yellow': '#F7CF6A'
  //   },
  //   fontFamily: {
  //     sans: ['Graphik', 'sans-serif'],
  //     serif: ['Merriweather', 'serif'],
  //   },
  //   extend: {
  //     fontFamily: {
  //       jetbrains: 'JetBrains-Mono-Thin'
  //     },
  //     spacing: {
  //       '128': '32rem',
  //       '144': '36rem',
  //     },
  //     borderRadius: {
  //       '4xl': '2rem',
  //     }
  //   }
  // },
  plugins: [
    require('@tailwindcss/forms'),
    require("daisyui"),
    require("@tailwindcss/typography"), require("daisyui"),
  ],
  daisyui: {
    themes: [{ ...themes }],
  },
}
