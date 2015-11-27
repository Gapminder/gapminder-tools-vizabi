//See https://code.google.com/p/selenium/wiki/WebDriverJs for detailed instructions

var webdriver = require('selenium-webdriver');
var SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
var expect = require('chai').expect;
var webdriverio = require('webdriverio');

var caps = {
  name: 'Gapminder',
  build: '1.0',

  browser_api_name: 'Chrome45x64',
  os_api_name: 'Mac10.11',

  screen_resolution: '1024x768',
  record_video: "true",
  record_network: "true",
  record_snapshot: "false",

  browserName: "chrome",
  username: "natali.abyss@gmail.com",
  password: "uc97483600d000c1"
};

var options = {
  host: 'hub.crossbrowsertesting.com',
  port: 80,
  desiredCapabilities: caps
};
// var options = {desiredCapabilities: {browserName: 'firefox'}};

var client = webdriverio.remote(options);

client
  .init()
  .url('http://www.gapminder.org/tools/')
  .url('http://www.gapminder.org/tools/bubbles')
  .url('http://www.gapminder.org/tools/mountain')

  .log('browser').then(function (browserLog) {
    console.log('log length:', browserLog.value.length);

    for (var i = 0; i < browserLog.value.length; i++) {
      //expect(browserLog.value[i].message).to.match(/^((?!Error)[\s\S])*$/);
      expect(browserLog.value[i].message).to.not.match(/Error/);
    }
  })

  .getTitle().then(function (title) {
    console.log('Title is: ' + title);
  })
  .end();