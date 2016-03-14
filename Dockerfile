FROM ubuntu:14.04

# apt-get update
RUN apt-get update

# tools
RUN apt-get install -y git
RUN apt-get install -y linux-libc-dev libkrb5-dev
RUN apt-get install -y curl python-virtualenv

# ruby and sass
RUN apt-get install -y ruby ruby-dev ruby-bundler
RUN gem install sass

# node.js 4
RUN curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
RUN apt-get install -y nodejs

# global node dependecies
RUN npm i -g webpack webpack-dev-server forever

# set up access to repo
# link: https://developer.github.com/guides/managing-deploy-keys/#deploy-keys

# clone project
#RUN git clone https://github.com/Gapminder/gapminder-tools-vizabi.git /home
#RUN cd home && git checkout feature_tp_server_routes && cd ../
COPY . /home/app
#VOLUME /home/app

WORKDIR /home/app

EXPOSE 3001

# install project dependecies
# run app server
CMD npm install && forever server.js
