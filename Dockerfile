# syntax=docker/dockerfile:1

# ---- Build aşaması: bağımlılıkları kur ve production build al ----
FROM node:20-alpine AS build
WORKDIR /app

# Önce sadece manifest dosyaları: lock değişmedikçe bu katman cache'ten gelir
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Kaynak kodu kopyala ve derle (tsc -b && vite build)
COPY . .
RUN npm run build

# ---- Serve aşaması: statik dosyaları nginx ile servis et ----
FROM nginx:alpine

# SPA fallback + cache + güvenlik header'ları içeren site konfigürasyonu
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Build çıktısını nginx web köküne kopyala
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# nginx:alpine imajının varsayılan CMD'i (foreground nginx) yeterli
