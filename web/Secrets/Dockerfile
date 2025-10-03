FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /app

USER root

COPY src/package*.json ./

RUN npm install

COPY src/ .

EXPOSE 3000
CMD ["node","server.js"]
