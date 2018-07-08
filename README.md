# Express Blog!
A scratch-build blog CRM.

I build this as an example of a reasonable node web application with authentication and CRUD functionality. It is also a code portfolio piece, since a lot of what I've written is hidden in proprietary apps.

The public facing UI is rendered on the server with Pug. It shows a list of blog posts, with links to the individual post pages.

There is a link to the admin backend, which is a React-based Single Page Application (client-side routing). While missing a couple necessary "real life" features such as email validation and password reset (mostly to keep from needed any external services for this project's functionality), the login and registration are generally secure.

> You can identify other email addresses which are attached to account. This would be easily solvable with email validation. Also, the registration is open to any user, and posts they make would be displayed. Given a specific desired usage, the fixes for both of these would be fairly trivial.

It should be noted that there is no technical reason the backend needs to be an SPA. This project is a showcase of how to do certain things "the right way", and one of those things is using an SPA with an API backend.

## Things to take away from Express Blog

These are some of the thing specifically done "right", which are fine to use in other applications. Express Blog is also licensed for use under the Free Public License 1.0.0 (0BSD), so feel free to use any or all of the code in other projects.

- Uses a relational DB
- Uses tools which eliminate the possibility of injection attacks in SQL, JavaScript, and HTML
  - (Knex for building DB queries, and React and Pug which both escape by default for their context)
- Uses the best password hashing option
  - Scrypt, via scrypt-for-humans (The next best options are Bcrypt and Argon2. The former is technically strictly worse, though generally good enough. Argon2 is technically better than Scrypt, but not as well tested and not yet supported well for general usage in Node.)
- Uses Eslint
- Uses type checked HTML generation
  - Neither Pug or React blindly concatenate strings to create HTML, so it's difficult or impossible to write invalid markup.
- Has authentication and authorization checks for routes where needed

There are some design choices in Express Blog which are not inherently good or bad, but have trade-offs which made sense for this app.

- The admin SPA code is separated from the backend
  - This allows for easy organization of the separate tooling and configuration needed for each.
- The admin SPA does not use centralized state
  - State is kept in React components. For this app, there is little to no need of any centralized state, except for possibly the user info.
- The admin SPA relies on the browser cache for keeping data around when moving between pages
- the admin SPA is not server rendered and then hydrated
  - Doing React SSR and hydration adds potentially significant complexity, and while there are notable benefits (especially for low power devices and users with poor connections), they may not always outweigh the costs.
- There are only two levels of permissions: everyone and authenticated
  - In many applications you will need at least two permission levels for authenticated users, to allow for "admin" and regular users, as well as the non-authenticated usage. There are a few ways to organize permissions, but frequently the best options for non-trivial permissions is roles which are stored in the DB with or for each user.
- Eslint is configured to primarily catch errors, rather than enforce code formatting

There are a couple problems with Express Blog which should be avoided in any "real life" applications.

- Email address should be verified before creating accounts
  - This requires access to a mail server of some kind.
- There should be a secure password reset
  - The current standard is to email a link with a secure token to the user's known email address. When they click the link it allows them to set a new password. This isn't truly ideal, as email accounts can be hijacked. Better possible solutions include security questions based on the user's usage patterns.
- The server file organization isn't perfect
  - Express Blog is tiny, so a simple flat organization of the backend works ok, but most apps should be better organized.
- The Node server itself does not have a production configuration
  - The `npm start` command should start the server in production mode, not development mode with Nodemon.
- More testing!
  - Express Blog has almost no tests. While not strictly necessary, it's a good idea to write tests for non-trivial functionality. Where possible, even simple snapshot tests of rendering can help catch unexpected changes.

## Some of the tools used

- React
- Express
- Parcel
- Babel
- Sass
- Postcss (css-modules, autoprefixer)
- Knex
- Postgresql
- Scrypt

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
