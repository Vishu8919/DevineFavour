/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",         // ✅ new app directory
    "./components/**/*.{js,ts,jsx,tsx}",  // ✅ component directory
    "./pages/**/*.{js,ts,jsx,tsx}",       // (optional, if still used)
  ],
  theme: {
    extend: {
      colors: {
        'rabbit-red': '#e11d48', 
      },
    },
  },
  plugins: [],
}
