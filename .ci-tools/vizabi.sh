#!/bin/sh

set -e

FORBIDDEN_BRANCHES="master development"
CURRENT_BRANCH="$(git branch -q --no-color --contains | awk {'print $2'})"

VIZABI_GIT_URL="https://github.com/gapminder/vizabi.git"
VIZABI_DST_DIR="node_modules/vizabi"
VIZABI_BRANCH="develop"


if [ "$(echo $FORBIDDEN_BRANCHES | grep -w $CURRENT_BRANCH | wc -l)" != 0 ]; then
    exit 0
fi

echo -e "\n\n\tInstalling vizabi from git and $VIZABI_BRANCH branch ...\n\n"

if [ -e $VIZABI_DST_DIR ]; then
    rm -rf $VIZABI_DST_DIR
fi

git clone $VIZABI_GIT_URL -b $VIZABI_BRANCH $VIZABI_DST_DIR

CURDIR=$(pwd)
cd $VIZABI_DST_DIR
    set -x
    npm run build
    set +x
cd $CURDIR
