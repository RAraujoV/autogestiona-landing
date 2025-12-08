# ===========================
# Etapa 1: Build de Vite/React
# ===========================
FROM node:20-alpine AS build
WORKDIR /app

# Copiar solo dependencias primero para mejor cache
COPY package*.json ./
RUN npm ci

# Copiar el resto del proyecto
COPY . .

# Generar la build optimizada
RUN npm run build



# ===========================
# Etapa 2: Servir con Nginx
# ===========================
FROM nginx:alpine

# ❗ IMPORTANTE: eliminar la config por defecto de Nginx que rompe las rutas
RUN rm -f /etc/nginx/conf.d/default.conf

# Copiar build generada por Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Crear una config nueva, limpia y compatible con React Router
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]

