/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/flowbite-react/**/*.js",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    colors: {
      'white': '#FFFFFF',
      'boring-white': '#FDFDFD',
      'gray-lightest': '#EEE',
      'gray-lighter': '#CCC',
      'gray-light': '#999',
      'gray': '#666',
      'gray-dark': '#444',
      'gray-darker': '#333',
      'gray-darkesr': '#222',
      // 'boring-black': '#1A1B1E',
      'boring-black': '#111',
      'black': '#000000',
      'boring-orange': '#e94d17',
      'boring-red': '#FF382A',
      'boring-green': '#85D680',
      'boring-blue': '#5AB0E2',
      'boring-yellow': '#F7CF6A'
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      fontFamily: {
        jetbrains: 'JetBrains-Mono-Thin'
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    }
  },
  plugins: [
    // ...
    require('@tailwindcss/forms'),
    require("flowbite/plugin"),
  ],
}
