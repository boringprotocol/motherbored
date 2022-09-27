/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      'white': '#fff',
      'blue': '#1fb6ff',
      'pink': '#ff49db',
      'orange': '#ff7849',
      'yellow': 'yellow',
      'green': '#85D680',
      'red': 'red',
      'gray-dark': '#262729',
      'gray': '#8492a6',
      'gray-light': '#d3dce6',
      'gray-lightest': '#d3dce6',
      'gray-lightestest': '#F5F5F5',
      'black': '#000000',
      'boring-black': '#1A1B1E',
      'boring-white': '#FDFDFD'
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
  ],
}
