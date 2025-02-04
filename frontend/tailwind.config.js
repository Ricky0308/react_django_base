/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        lightblue: {
          500: '#ADD8E6', // Light blue color
          200: '#B0E0E6', // Lighter shade for hover
        },
      },
    },
  },
  plugins: [],
}

