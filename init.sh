#!/bin/bash

yarn
cd example-consumer
yarn
cd ..
docker-compose up -d
./wait-for-it.sh localhost:5439
knex seed:run --specific initialize_acme.js
