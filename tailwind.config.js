/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sage: '#819983', // 🌿 Verde Salvia
        sand: '#fef7ef', // 🏜️ Arena Cálida
        deep: '#273b51', // 🌊 Azul Profundo
      },
    },
  },
  plugins: [],
};