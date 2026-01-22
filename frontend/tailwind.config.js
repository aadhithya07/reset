/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'movie-black': '#121212',
        'movie-gray': '#1e1e1e',
        'movie-yellow': '#f5c518',
      }
    },
  },
  plugins: [],
}