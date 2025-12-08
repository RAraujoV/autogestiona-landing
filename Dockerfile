# Etapa 1 — Build de Vite
FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build


# Etapa 2 — Nginx final
FROM nginx:alpine

# Copia el build generado a la carpeta pública de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia tu configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
