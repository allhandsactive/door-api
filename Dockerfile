FROM node:12.18.2

ENV NODE_ENV production

# update npm
RUN npm install -g npm@6.14.7

WORKDIR /api

COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install

COPY ./ ./

EXPOSE 3000/tcp

ENTRYPOINT ["npm", "start"]
