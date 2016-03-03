#!/usr/bin/env bash

# Give mongo and redis a chance to start up
sleep 2

cd server
echo "* Installing server dependencies"
npm install
cd ..
echo "* Starting Express server, listening on file changes in server/*.*"
nodemon -L -w . server/server.js

exit 0
