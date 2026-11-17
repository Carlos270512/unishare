# ── Etapa de compilacion ──────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

# Copiar manifests para aprovechar la cache de dependencias
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Etapa de ejecucion ────────────────────────────────
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
