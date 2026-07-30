FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++ openssl
COPY apps/api/package*.json ./
RUN npm install

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY apps/api ./
RUN npx prisma generate && npm run build

FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package.json ./
EXPOSE 4000
CMD ["sh", "-c", "npx prisma db push --skip-generate && (node dist/main.js || node dist/src/main.js)"]
