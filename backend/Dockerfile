FROM node:20-alpine

WORKDIR /app

# Solo dependencias primero (cache)
COPY package*.json ./

# Instalación reproducible
RUN npm ci --omit=dev

# Copiar código
COPY . .

# Asegurar directorios de uploads
RUN mkdir -p public/uploads/imagenes public/uploads/perfiles

EXPOSE 3000

CMD ["node", "server.js"]
