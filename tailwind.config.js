// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  // 💥 ESTE BLOQUE ES LA CLAVE 💥
  content: [
    "./index.html",
    // ⬇️ Necesita encontrar todos los archivos React dentro de src
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}