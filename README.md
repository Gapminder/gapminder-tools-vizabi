# Gapminder Tools Page

The Gapminder Tools Page ([http://gapminder.org/tools](http://gapminder.org/tools)) is an Angular application that leverages the [Vizabi](http://vizabi.org) visualization framework in order to display and animate information about the world. 

As a backend, it uses a [Node.js Express](http://expressjs.com/)-based server to process and cache indicator information stored in a [MongoDB](https://www.mongodb.org/) database. This Express-backend is called "Server" in this repository. 

The frontend Angular app is built and packaged locally using [Webpack](https://webpack.github.io/). The packaged client code in `client/dist/` is in turn served by the Express server above. 

## Requirements

### Server

The server and it's dependencies are encapsulated using Docker. The only dependency thus is Docker Toolbox:

 - [Docker Toolbox](https://www.docker.com/products/docker-toolbox) v1.10+

### Client

The client code runs and is packaged locally. The following packages needs to be installed on your workstation:

- [Node and npm](http://nodejs.org) v4.2.6+ *If node was already installed remove node_modules and reinstall after upgrade*
- [Ruby](http://ruby-lang.com/)
- [Sass](http://sass-lang.com/) : `gem install sass`
- [Webpack](https://webpack.github.io/) : `npm i -g webpack webpack-dev-server`

## Installation (First time set-up)

1. Clone the repository: `git clone git@github.com:Gapminder/gapminder-tools-vizabi.git`
2. Step into the checked out folder: `cd gapminder-tools-vizabi`
3. Install client dependencies: `npm install`

## Development

On daily basis you will likely use:

One terminal or from webstorm:
```bash
cd server
docker-compose up
```

Second terminal:
```bash
npm run dev
```

View in browser at `http://localhost:8080/tools/`:

```bash
open http://localhost:8080/tools/
```

### Server-specific

By default, a remote mongo database (hosted at mongolab.com) is used for development. To use the local mongo docker container:

```bash
docker-compose -f docker-compose.yml -f docker-compose.local-mongodb.yml up
```

### Client-specific

1. `npm run dev` - start serving UI only on port 8080, uses in memory file system
2. `npm run build` - creates static dev build of UI
3. `npm run deploy` - creates static, production ready UI files
4. `npm start` - starts API and `npm run build`
5.  Specify port and host:
- WS_HOST = `waffle-server env host` || localhost
- WS_PORT = `waffle-server env port ` || 3000

#### Update vizabi

```bash
npm i vizabi@latest -S
```

## Environments

**Develop**
http://tools-dev.gapminderdev.org:3001/ - Here you have the latest version. Sometimes it is updated many times an hour. 
Waffle server: `http://waffle-server-dev.gapminderdev.org`

**Stage**
https://tools-stage.gapminderdev.org/ - released once every week, usually
Waffle server: `http://waffle-server-stage.gapminderdev.org/`

**Production (live)**
https://tools-prod.gapminderdev.org/ 
http://www.gapminder.org/tools/
Waffle server: `http://waffle-server.gapminderdev.org/`
