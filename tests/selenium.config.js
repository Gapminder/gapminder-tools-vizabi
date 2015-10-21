//See https://code.google.com/p/selenium/wiki/WebDriverJs for detailed instructions

var webdriver = require('selenium-webdriver');
var SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
var expect = require('chai').expect;
var webdriverio = require('webdriverio');


var caps = {
  name: 'gapminder.org',
  build: '1.0',

  browser_api_name: 'FF38',
  os_api_name: 'Mac10.10',

  screen_resolution: '1600x1200',
  record_video: "true",
  record_network: "true",
  record_snapshot: "true",

  browserName: "firefox",
  username: "natali.abyss@gmail.com",
  password: "uc97483600d000c1"
};

/*var options = {
  host: 'hub.crossbrowsertesting.com',
  port: 80,
  desiredCapabilities: caps
};
//*/ var options = {desiredCapabilities: {browserName: 'firefox'}};

var client = webdriverio.remote(options);

client
  .init()
  //.url('http://www.gapminder.org/tools/')
  .url('http://www.gapminder.org/tools/bubbles')
  //.url('http://www.gapminder.org/tools/mountain')


  .log('browser').then(function (browserLog) {
    console.log('log1', browserLog.value.length);

    for (var i = 0; i < browserLog.value.length; i++) {
      expect(browserLog.value[i].message).to.not.match(/Error/);
      //expect(browserLog.value[i].message).to.match(/^((?!Error)[\s\S])*$/);
    }
  })

  .getTitle().then(function (title) {
    console.log('Title is: ' + title);
  })
  .end();