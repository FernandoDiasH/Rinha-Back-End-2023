FROM node:20.14.0-alpine3.20

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

EXPOSE 3000

CMD [ "npm", "run", "docker"]