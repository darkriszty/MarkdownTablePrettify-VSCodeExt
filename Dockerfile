FROM node:current

WORKDIR /app

COPY . .

RUN npm ci
RUN npm run compile

ENTRYPOINT [ "node", "./out/cli/index.js" ]