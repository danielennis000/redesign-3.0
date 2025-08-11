/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'asu-maroon': '#8C1D40',
        'asu-gold': '#FFC627',
        'asu-black': '#1E1E1E',
        'asu-white': '#FFFFFF',
        'asu-rich-black': '#0B0B0B',
        'asu-gray-100': '#F7F7F7',
        'asu-gray-200': '#EFEFEF',
        'asu-gray-300': '#DCDCDC',
        'asu-gray-500': '#7A7A7A',
        'asu-gray-700': '#484848',
        'info-blue': '#00B0F3',
        'success-green': '#1DB954',
        'warning-orange': '#FF8C42',
        'error-red': '#D61F1F',
      },
      fontFamily: {
        sans: ["DM Sans", 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 