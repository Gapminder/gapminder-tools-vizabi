FROM ubuntu:14.04

# apt-get update
RUN apt-get update

# tools
RUN apt-get install -y linux-libc-dev libkrb5-dev
RUN apt-get install -y curl python-virtualenv
RUN apt-get install -y git

# ruby and sass
RUN apt-get install -y ruby ruby-dev ruby-bundler
RUN gem install sass

# node.js 4
RUN curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
RUN apt-get install -y nodejs

# global node dependecies
RUN npm i -g webpack webpack-dev-server nodemon forever

# set working directory
VOLUME /home/app
WORKDIR /home/app

# run server
CMD server/docker-start-server.sh
