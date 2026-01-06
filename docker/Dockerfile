## Build
FROM node:lts-alpine3.23 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci


## Runtime
FROM node:lts-alpine3.23

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

COPY . .

EXPOSE 3000


CMD ["npm", "start"]