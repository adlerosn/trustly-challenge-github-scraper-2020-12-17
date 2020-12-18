FROM node:14-alpine3.12
RUN mkdir -p /app/src
WORKDIR /app
COPY package.json /app
COPY package-lock.json /app
COPY src/ /app/src/
RUN npm install
CMD [ "npm", "run", "serve" ]
EXPOSE 8000