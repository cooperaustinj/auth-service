## Local development + Running Locally

1. Run `./init.sh`

or

1. `yarn`
1. `cd example-consumer && yarn && cd ..`
1. `docker-compose up` or `docker-compose up -d`
1. `knex seed:run --specific initialize_acme.js`

Go to `http://localhost:3009` and enjoy. The source code is mounted in the containers, and the servers restart when the source changes.

## Query Database

The auth service uses a PostgreSQL database. To query, connect while the container is running with this info:

| Key      | Value              |
| -------- | ------------------ |
| Username | auth_user          |
| Password | auth_user_password |
| Database | local_auth_service |
| Host     | localhost          |
| Port     | 5439               |
