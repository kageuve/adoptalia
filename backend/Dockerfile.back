# Usamos una imagen ligera de Node
FROM node:18-alpine

# Directorio de trabajo en el contenedor
WORKDIR /app

# Copiamos package.json primero (optimiza caché de Docker)
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "start"]
