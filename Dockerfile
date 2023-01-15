FROM node:18.13.0

ENV NODE_ENV production

# update npm
RUN npm install -g npm@9.3.0

WORKDIR /api

COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install

COPY ./ ./

EXPOSE 3000/tcp

ENTRYPOINT ["npm", "start"]
