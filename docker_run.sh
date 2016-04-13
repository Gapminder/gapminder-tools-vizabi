#!/bin/bash

### Run commands
### docker rm -f $(docker ps -a -q --filter='name=gtv')

imgId=$(docker ps -a -q --filter='name=gtv')
echo "gtv container: $imgId"

if [ "$imgId" != "" ]
  then
    docker rm -f $imgId
fi

docker build --tag gtv:latest .
docker run --name gtv --net=host -p 80:80 $(docker images -a -q gtv)
