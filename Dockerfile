FROM node:16.13.1-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY chatandvideo/package.json ./
COPY chatandvideo/package-lock.json ./
RUN npm install
COPY chatandvideo ./

EXPOSE 3000
CMD ["node", "/app/node_modules/.bin/react-scripts", "--max-old-space-size=4096", "start"]