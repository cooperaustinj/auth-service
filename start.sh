#!/bin/bash

set -e

./wait-for-it.sh db:5432

knex migrate:latest
yarn serve