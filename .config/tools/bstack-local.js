#!/usr/bin/env node

'use strict';

var shell = require('shelljs');
var path = require('path');
var fs = require('fs');
var BrowserStackTunnel = require('browserstacktunnel-wrapper');
var cwd = path.dirname(require.main.filename);

var confDir = path.dirname(cwd);

var TUNNEL_IDENTIFIER = process.env.TRAVIS_BUILD_NUMBER;
var READY_FILE = path.join(' ', 'tmp', 'bstack-' + TUNNEL_IDENTIFIER + '.ready').trim();
var ACCESS_KEY = process.env.BROWSER_STACK_ACCESS_KEY;
var HOST = 'localhost';
var PORT = process.env.PORT || 3001

console.log('Starting tunnel on port', PORT);

shell.exec("wget https://www.browserstack.com/browserstack-local/BrowserStackLocal-linux-x64.zip -P /tmp");
shell.exec("unzip -o /tmp/BrowserStackLocal-linux-x64.zip -d /tmp");

var tunnel = new BrowserStackTunnel({
  key: ACCESS_KEY,
  localidentifier: TUNNEL_IDENTIFIER,
  hosts: [{name: HOST,
    port: PORT,
    sslFlag: 0}],
    linux64Bin: "/tmp",
});

tunnel.start(function(error) {
  if (error) {
    console.error('Can not establish the tunnel', error);
  } else {
    console.log('Tunnel established.');

    if (READY_FILE) {
      fs.writeFile(READY_FILE, '');
    }
  }
});
