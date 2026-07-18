FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY server/package*.json ./server/

RUN npm install --workspace server

COPY server ./server

WORKDIR /app/server
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
COPY server/package*.json ./server/

RUN npm install --workspace server --only=production

COPY --from=builder /app/server/dist ./server/dist

EXPOSE 5000

ENV NODE_ENV=production

CMD ["npm", "run", "start", "--workspace", "server"]
