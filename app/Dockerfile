# 1. Usamos Node.js 20 para cumplir con los requisitos de Next.js
FROM node:20-alpine

# 2. Directorio de trabajo
WORKDIR /app

# 3. Copia de dependencias
COPY package*.json ./

# 4. Instalación
RUN npm install

# 5. Copia del código fuente
COPY . .

# 6. Construcción de producción
RUN npm run build

# 7. Puerto
EXPOSE 3000

# 8. Inicio
CMD ["npm", "start"]