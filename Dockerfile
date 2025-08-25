FROM node:22-alpine AS builder

WORKDIR /tmp

# Install node modules first to leverage Docker cache.
COPY package*.json ./
RUN npm ci

COPY tsconfig.json .
COPY cli/ cli/
COPY src/ src/
RUN npm run compile


FROM node:22-alpine

WORKDIR /app

COPY --from=builder /tmp/out .

USER node

ENTRYPOINT [ "node", "./cli/index.js" ]
