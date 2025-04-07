/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx,mdx}',
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#ebf8ff',
            100: '#bee3f8',
            200: '#90cdf4',
            300: '#63b3ed',
            400: '#4299e1',
            500: '#3182ce',
            600: '#2b6cb0',
            700: '#2c5282',
            800: '#2a4365',
            900: '#1a365d',
          },
          secondary: {
            50: '#f7fafc',
            // ... 他の色調
            900: '#1a202c',
          },
        },
        fontFamily: {
          sans: ['Hiragino Sans', 'Meiryo', 'sans-serif'],
          serif: ['Hiragino Mincho ProN', 'Yu Mincho', 'serif'],
        },
      },
    },
    plugins: [],
  }