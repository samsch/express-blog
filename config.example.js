// The value provided in config.js would ideally pull from environment variables. (https://12factor.net/config)
'use strict';
module.exports = {
  // This is the session key, used to sign session tokens.
  // This needs to be a long, cryptographically secure random string.
  // In Linux, you can generate such a string with `cat /dev/urandom | env LC_CTYPE=C tr -dc _A-Za-z0-9 | head -c${1:-64}`
  secret: 'long secret string',

  // The port to serve plaintext http.
  port: 1337,

  // HTTPS config
  // For development, you can generate a self-signed cert using:
  // `openssl req -x509 -newkey rsa:2048 -sha256 -nodes -keyout key.pem -out cert.pem -days 365`.
  // For production, you can use the free https://letsencrypt.org/ service to obtain a cert and key file,
  // or get them from other services.
  // If you don't define securePort, the app will be served over http only, but you could also provide
  // tls/https by using a proxy server. This is actually recommended by some.
  securePort: 1338, // [Optional] Port to serve secure https.
  tlsKey: 'ssl/key.pem', // [Optional, required if using securePort] HTTPS/TLS certificate private key file.
  tlsCert: 'ssl/cert.pem', // [Optional, required if using securePort] HTTPS/TLS certificate file.

  // Other config
  users: {
    // Simple in-memory user store, used by the boilerplate application.
    // this should be removed and replaced with a database (here and in the app code) for a "real" application,
    // but for development you can generate a password using the `scrypt-for-humans` package to use this store.
    // The property name is the username.
    myuser: 'generated scrypt password',
  },
};
