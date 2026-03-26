FROM node:20-alpine

WORKDIR /app

# Solo dependencias primero (cache)
COPY package*.json ./

# Instalación reproducible
RUN npm ci --omit=dev

# Copiar código
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
