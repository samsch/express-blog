'use strict';
module.exports = {
  secret: process.env.APP_SESSION_SECRET,
  port: process.env.APP_HTTP_PORT,
  securePort: process.env.APP_SECURE_PORT,
  tlsKey: process.env.APP_SECURE_KEY,
  tlsCert: process.env.APP_SECURE_CERT,
  pgconnection: {
    database: process.env.PG_USER,
    user: process.env.PG_PASSWORD,
    password: process.env.PG_DATABASE,
  },
};
