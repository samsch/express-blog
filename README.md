# Express Blog!
It's a blog made with Express, with a React SPA front end!

I build this as an example of a secure node web application with authentication and CRUD functionality. It is also a code portfolio piece, since a lot of what I've written is hidden in proprietary apps.

Please note that a client-side rendered blog is not particularly efficient. Generally blogs should be rendered by the backend.

## Some of the tools used

- React
- Express
- Webpack
- Babel
- Sass
- Postcss (css-modules, autoprefixer)
- Knex
- Postgresql
- Scrypt

## Errata

There are things some problems in this app

- Missing error handling on fetch calls in the client
  - Need to add some `.catch()` calls on the Promise chains which output notifications
- Navigation doesn't actually navigate, but does use anchor tags
  - Either replace current navigation with React Router (better), or make the anchors all buttons (easier)
- Improve the styles
  - The important part of this app is the functionality and code, but the styles could use a little TLC too

## Running the app

(Sorry, no instructions for Windows users. You can probably use WSL or git bash, but that's not tested.)

A few environment variables are needed. For development, I put these in a `.env` file in the project root. The `example.env` file can be copied to `.env` and modified. It contains the descriptions of the required vars, as well as helpful info for generating or getting the values. **You need these vars in your path to run the following commands.** You can add them by running `source ./.env` in a bash shell.

To build the client, start a terminal in the `client/` folder, run `npm install` and `npm run build`. This will output the client build to the `server/public/` folder.

To run the server, change directories to `server/` (relative to the project root), and run `npm install` and `npm start`.

To make this easier for myself, I usually create some bash scripts like so:

`run`, which starts the blog api server.
```bash
#!/bin/bash
source ./.env
cd server
npm start
```

`build`, which builds the front end.
```bash
#!/bin/bash
source ./.env
cd client
npm run build
```

`dev`, which runs webpack-dev-server for the front end, allowing build-on-save. It's setup to proxy to the api server.
```bash
#!/bin/bash
source ./.env
cd client
npm start
```
