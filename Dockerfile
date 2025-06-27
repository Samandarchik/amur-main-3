# Oddiy single-stage Dockerfile
FROM node:18-alpine

WORKDIR /app

# Package fayllarini nusxalash
COPY package*.json ./

# Dependencies o'rnatish
RUN npm install

# Loyihani nusxalash
COPY . .

# Build qilish
RUN npm run build

# Environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Port ochish
EXPOSE 3000

# Server ishga tushirish
CMD ["npm", "start"]