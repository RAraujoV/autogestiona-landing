// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // CAMBIO CLAVE: Usamos el nuevo nombre del plugin
    autoprefixer: {},
  },
}