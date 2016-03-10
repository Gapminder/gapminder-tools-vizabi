# Gapminder Tools page
> This is the gapminder tools page

Code for page: [http://gapminder.org/tools](http://gapminder.org/tools)

## Requirements

- [Node and npm](http://nodejs.org) *If node was already installed remove node_modules and reinstall after upgrade*
- [Ruby](http://ruby-lang.com/)
- [Sass](http://sass-lang.com/) : `gem install sass`
- [Webpack](https://webpack.github.io/) and [webpack dev server](https://webpack.github.io/docs/webpack-dev-server.html)
```bash
npm i -g webpack webpack-dev-server
```

## Installation

1. Clone the repository: `git clone git@github.com:Gapminder/gapminder-tools-vizabi.git`
3. Start the server (with default data source): `npm start`
4. View in browser at `http://localhost:3001`

## Alignment

1. `npm run local`
  - starts UI on `localhost:3001`
  - default WS_HOST: `localhost`
  - default WS_PORT: `3000`
2. `npm run dev`
  - serving on port 8080 `http://localhost:8080`, uses in memory file system
  - default WS_HOST: `https://waffle-server-dev.gapminderdev.org`
3. `npm run stage`
  - serving on port 8080 `http://localhost:8080`, uses in memory file system
  - default WS_HOST: `https://waffle-server-stage.gapminderdev.org`
4. `npm run prod`
  - creates static, production ready UI files
  - starts simple server for serving static files `http://localhost:3001`
  - default WS_HOST: `https://waffle-server.gapminderdev.org`
5. `npm run build`
  - creates static development build into the directory `client/dist`
  - default WS_HOST: `https://waffle-server-stage.gapminderdev.org`
6. `npm run deploy`
  - creates static, production ready UI files
  - default WS_HOST: `https://waffle-server.gapminderdev.org`
7. `npm start`
  - creates static stage build into the directory `client/dist`
  - starts simple server for serving static files `http://localhost:3001`

## Specify port and host:

- WS_HOST = `waffle-server env host` || `http://localhost`
- WS_PORT = `waffle-server env port ` || `3000`

Example as WS_HOST and WS_PORT could be setup:
```bash
WS_HOST=http://localhost WS_PORT=3000 npm run local
```

Default WaffleServer URL is `https://waffle-server-stage.gapminderdev.org` is used in the Vizabi library: vizabi-gapminder.js file

## Docker

`docker build .`
`docker run  --net=host -p 3001:3001 IMAGE_ID`

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
