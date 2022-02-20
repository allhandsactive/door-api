FROM node:16.14.0

ENV NODE_ENV production

# update npm
RUN npm install -g npm@8.5.1

WORKDIR /api

COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install

COPY ./ ./

EXPOSE 3000/tcp

ENTRYPOINT ["npm", "start"]
