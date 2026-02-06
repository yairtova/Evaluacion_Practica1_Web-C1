# 1. Usamos Node.js 20 para cumplir con los requisitos de Next.js
FROM node:20-alpine AS builder

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

# 7. Segunda etapa: Ejecución
FROM node:20-alpine AS runner

# 8. Directorio de trabajo
WORKDIR /app

# 9. Copia de la aplicación construida desde la etapa 'builder'
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# 10. Puerto
EXPOSE 3000

# 11. Inicio
CMD ["npm", "start"]