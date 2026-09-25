# Etapa 1: construcción de la aplicación
FROM node:22-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias de forma reproducible
RUN npm ci

# Copiar el código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build


# Etapa 2: servidor web
FROM nginx:alpine

# Copiar los archivos generados por Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Puerto utilizado por Nginx
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]