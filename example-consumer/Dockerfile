FROM node:14

ENV PORT 3009

WORKDIR /usr/example_consumer

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 3009
CMD ["yarn", "serve"]