'use strict';
const { pgconnection } = require('../config');
module.exports = {
  client: 'postgresql',
  connection: {
    database: pgconnection.database,
    user: pgconnection.user,
    password: pgconnection.password,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};
