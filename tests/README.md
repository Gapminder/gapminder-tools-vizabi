# Tests

## Installation

- npm install -g webdriver-manager
- npm install -g protractor
- npm install -g karma
- npm install -g karma-cli


## Run test

- update webdriver: webdriver-manager update --standalone
- start webdriver: webdriver-manager start
- start selenium test: `npm run webdriver`
- start protractor test: protractor ./tests/protractor.conf.js

## Run test karma

- start test: karma start
- start test for saucelabs: karma start karma.conf-ci.js
- start test for e2e: karma start karma-e2e.conf.js