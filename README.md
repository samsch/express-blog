# Express Blog!
It's a blog made with Express, with a React SPA frontend!

(Which means this isn't actually a good model for a production blog, since blogs can be easily server rendered.)

## Running the app

(Sorry, no instructions for Windows users)

A few environment variables are needed. For development, I put this in a `.env` file in the project root. The `example.env` file can be copied to `.env` and modified. It contains the descriptions of the required vars, as well as helpful info for generating or getting the values. **You need thses vars in your path to run the following commands.** You can add them by running `source ./.env` in a bash shell.

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

`build`, which builds the frontend.
```bash
#!/bin/bash
source ./.env
cd client
npm run build
```

`dev`, which runs webpack-dev-server for the frontend, allowing build-on-save. It's setup to proxy to the api server.
```bash
#!/bin/bash
source ./.env
cd client
npm start
```
