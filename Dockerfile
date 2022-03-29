FROM node:16.13.1-alpine

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

RUN if [ "${PRODUCTION}" = "true" ]; then
    COPY chatandvideo/package.json ./
    COPY chatandvideo/package-lock.json ./
    RUN npm install
    COPY chatandvideo ./
    fi
RUN if [ "${PRODUCTION}" = "false" ]; then
    RUN if ["${NUMBER}" = "1"]; then
      COPY TestingOne/package.json ./
      COPY TestingOne/package-lock.json ./
      RUN npm install
      COPY TestingOne ./
      fi
    RUN if ["${NUMBER}" = "2"]; then
      COPY TestingTwo/package.json ./
      COPY TestingTwo/package-lock.json ./
      RUN npm install
      COPY TestingTwo ./
      fi
    RUN if["${NUMBER}" = "3"]; then
      COPY TestingThree/package.json ./
      COPY TestingThree/package-lock.json ./
      RUN npm install
      COPY TestingThree ./
      fi
    fi
CMD ["node", "/app/node_modules/.bin/react-scripts", "--max-old-space-size=4096", "start"]