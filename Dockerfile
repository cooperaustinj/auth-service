FROM node:14

ENV PORT 3000

WORKDIR /usr/auth_service

RUN yarn global add knex

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 3000
CMD "./start.sh"