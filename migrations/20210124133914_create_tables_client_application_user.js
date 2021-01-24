exports.up = function (knex) {
    return knex.raw(`
        CREATE TABLE client (
            id INT PRIMARY KEY generated always AS identity,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            client_name VARCHAR(127) NOT NULL UNIQUE,
            is_active BOOLEAN NOT NULL
        );
        
        CREATE TABLE client_application (
            id INT PRIMARY KEY generated always AS identity,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            client_id INT REFERENCES client(id),
            application_name VARCHAR(127) NOT NULL UNIQUE,
            is_active BOOLEAN NOT NULL,
            private_key VARCHAR(2047) NOT NULL UNIQUE,
            public_key VARCHAR(1023) NOT NULL UNIQUE
        );
        
        CREATE TABLE application_user (
            id INT PRIMARY KEY generated always AS identity,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            application_id INT NOT NULL REFERENCES client_application(id),
            email VARCHAR(95) NOT NULL UNIQUE,
            first_name VARCHAR(63) NOT NULL,
            last_name VARCHAR(63) NOT NULL,
            hashed_password VARCHAR(255) NOT NULL,
            is_active BOOLEAN NOT NULL
        );
    `);
};

exports.down = function (knex) {
    return knex.raw(`
    DROP TABLE application_user;
    DROP TABLE client_application;
    DROP TABLE client;
    `);
};
