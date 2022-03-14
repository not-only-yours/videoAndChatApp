FROM node:16.13.1-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./


RUN npm install

COPY . ./

CMD ["node", "/app/node_modules/.bin/react-scripts", "--max-old-space-size=4096", "start"]