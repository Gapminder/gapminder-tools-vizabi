# Gapminder Tools page
> This is the gapminder tools page

Code for page: [http://gapminder.org/tools](http://gapminder.org/tools)

## Requirements

- [Node and npm](http://nodejs.org) *If node was already installed remove node_modules and reinstall after upgrade*
- [Webpack](https://webpack.github.io/) and [webpack dev server](https://webpack.github.io/docs/webpack-dev-server.html)
```bash
npm i -g webpack webpack-dev-server
```

## Installation

1. Clone the repository: `git clone git@github.com:Gapminder/gapminder-tools-vizabi.git`
3. Start the server (with default data source): `npm start`
4. View in browser at `http://localhost:3001`

## Alignment

1. Local Environment

  - default Waffle Server Host: `WS_HOST=localhost`
  - default Waffle Server Port: `WS_PORT=3000`

  1.1 `npm run local:build`
    - build project with webpack to `client/dist` directory

  1.2 `npm run local`
    - build project and start server on `localhost:3001`

  1.3 `npm run local:hot`
    - start server on `localhost:8080`
    - serve changes from webpack bundle (webpack-dev-server)

2. Development Environment

  - default Waffle Server Host: `WS_HOST=https://waffle-server-dev.gapminderdev.org`

  2.1 `npm run dev:build`
    - build project with webpack to `client/dist` directory

  2.2 `npm run dev`
    - build project and start server on `localhost:3001`

  2.3 `npm run dev:forever`
    - build project and start server on `localhost:3001` via forever

  2.4 `npm run dev:docker`
    - !vizabi should be built before in docker (shared volume will be created)
    - build project in docker container and start serve on `localhost:3001`

3. Stage Environment

  - default Waffle Server Host: `WS_HOST=https://waffle-server-stage.gapminderdev.org`

  3.1 `npm run stage:build`
    - build project with webpack to `client/dist` directory

  3.2 `npm run stage`
    - build project and start server on `localhost:3001`

  3.3 `npm run stage:forever`
    - build project and start server on `localhost:3001` via forever

4. Production Environment

  - default Waffle Server Host: `WS_HOST=https://waffle-server.gapminderdev.org`

  4.1 `npm run prod:build`
    - build project production ready with webpack to `client/dist` directory

  4.2 `npm run prod`
    - build project and start server on `localhost:3001`

  4.3 `npm run prod:forever`
    - build project and start server on `localhost:3001` via forever

5. Server Start

  - use created static files from `client/dist` directory

  5.1 `npm run serve`
    - start server on `localhost:3001`

  5.2 `npm run serve-forever`
    - start server on `localhost:3001` via forever

6. Simple Start

`npm start`

- build project with webpack to `client/dist` directory using Development Environment
- start server on `localhost:3001`

## Specify Waffle Server port and host:

- WS_HOST = `waffle-server env host` || `http://localhost`
- WS_PORT = `waffle-server env port ` || `3000`

Example as WS_HOST and WS_PORT could be setup:
```bash
WS_HOST=http://localhost WS_PORT=3000 npm run local
```

Default WaffleServer URL is `https://waffle-server-stage.gapminderdev.org` is used in the Vizabi library: vizabi-gapminder.js file

## Docker

`npm run dev:docker`

## List of Waffle Server environments:

```
# development *BEWARE!!! This environment you use only on your's own responsibility*
  - HOST_URL: `https://waffle-server-dev.gapminderdev.org`
  - PORT: null

# stage
  - HOST_URL: `https://waffle-server-stage.gapminderdev.org`
  - PORT: null

# production (live)
  - HOST_URL: `https://waffle-server.gapminderdev.org`
  - PORT: null
```

## Update vizabi library

```bash
npm i vizabi@latest -S
```

## List of Vizabi Tools environments

```
# development - here you have the latest version. Sometimes it is updated many times an hour.
  - `http://tools-dev.gapminderdev.org/`

# stage - released once every week, usually
  - `https://tools-stage.gapminderdev.org/`

# production (live)
  - `http://www.gapminder.org/tools/`
```
