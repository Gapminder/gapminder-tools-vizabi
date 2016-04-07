FROM ubuntu:14.04

RUN apt-get update

RUN apt-get install -y linux-libc-dev libkrb5-dev curl python-virtualenv ruby ruby-dev ruby-bundler git nginx

RUN curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
RUN apt-get install -y nodejs

RUN gem install sass
RUN gem install scss_lint

RUN npm i -g webpack@1.12.2 npm@3.8.0

COPY . /home/gapminder-tools-vizabi

WORKDIR /home/gapminder-tools-vizabi

RUN npm install
RUN npm run prod:build

RUN rm /usr/share/nginx/html/*
RUN cp -R ./client/dist/tools /usr/share/nginx/html/

COPY .config/nginx.conf /etc/nginx/

RUN apt-get remove -y linux-libc-dev libkrb5-dev curl python-virtualenv ruby ruby-dev ruby-bundler git nodejs

WORKDIR /home
RUN rm -rf /home/gapminder-tools-vizabi

VOLUME ["/var/log"]
EXPOSE 80

CMD ["/usr/sbin/nginx"]
