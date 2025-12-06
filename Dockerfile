# Etapa 1: Construcción (Genera los archivos estáticos de React/Vite)
FROM node:20-alpine as build
WORKDIR /app
# Copiamos solo los archivos de dependencias para aprovechar el caché de Docker
COPY package*.json ./
# Instalamos dependencias de forma limpia
RUN npm ci
# Copiamos el resto del código
COPY . .
# Generamos la versión optimizada para producción (carpeta 'dist')
RUN npm run build

# Etapa 2: Servidor (Usa Nginx para servir la web de forma ligera y eficiente)
FROM nginx:alpine
# Copiamos los archivos estáticos generados en la Etapa 1
COPY --from=build /app/dist /usr/share/nginx/html

# Configuración de Nginx para manejar rutas de React (permite que /beneficios funcione)
RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

# Indica que el contenedor escuchará en el puerto 80
EXPOSE 80
# Comando de inicio del servidor Nginx
CMD ["nginx", "-g", "daemon off;"]