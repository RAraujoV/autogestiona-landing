// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // La clave es que detecte archivos .html, .js, .jsx, etc.
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}