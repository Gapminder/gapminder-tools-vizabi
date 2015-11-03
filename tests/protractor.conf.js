exports.config = {

  sauceUser: "NataliSol",
  sauceKey: "b09d8f7f-01cd-403b-a8e5-84fdf39d0efd",

  //seleniumAddress: 'http://localhost:4444/wd/hub',

/*
  getPageTimeout: 600000,
  allScriptsTimeout: 99999,*/

  multiCapabilities: [
    {
      base: "SauceLabs",
      browserName: "Android",
      platform: "Linux",
      version: "4.0"
    },
    {
      base: "SauceLabs",
      browserName: "Android",
      platform: "Linux",
      version: "4.1"
    },
    {
      base: "SauceLabs",
      browserName: "Android",
      platform: "Linux",
      version: "4.2"
    },
    {
      base: "SauceLabs",
      browserName: "Android",
      platform: "Linux",
      version: "4.3"
    },
    {
      base: "SauceLabs",
      browserName: "Android",
      platform: "Linux",
      version: "4.4"
    },
    {
      base: "SauceLabs",
      browserName: "Android",
      platform: "Linux",
      version: "5.0"
    },
    {
      base: "SauceLabs",
      browserName: "Chrome",
      platform: "Windows 8.1"
    },
    {
      base: "SauceLabs",
      browserName: "Chrome",
      platform: "Linux"
    },
    {
      base: "SauceLabs",
      browserName: "Chrome",
      platform: "OS X 10.10"
    },
    {
      base: "SauceLabs",
      browserName: "Firefox",
      platform: "Windows 8.1"
    },
    {
      base: "SauceLabs",
      browserName: "Firefox",
      platform: "Linux"
    },
    {
      base: "SauceLabs",
      browserName: "Firefox",
      platform: "OS X 10.10"
    },
    /*{
      base: "SauceLabs",
      browserName: "Internet Explorer",
      platform: "Windows 7",
      version: "9"
    },
    {
      base: "SauceLabs",
      browserName: "Internet Explorer",
      platform: "Windows 8",
      version: "10"
    },
    {
      base: "SauceLabs",
      browserName: "Internet Explorer",
      platform: "Windows 8.1",
      version: "11"
    },*/
    {
      base: "SauceLabs",
      browserName: "iPhone",
      platform: "OS X 10.8",
      version: "6.1"
    },
    {
      base: "SauceLabs",
      browserName: "iPhone",
      platform: "OS X 10.9",
      version: "7.1"
    },
    {
      base: "SauceLabs",
      browserName: "iPhone",
      platform: "OS X 10.10",
      version: "8.1"
    },
    {
      base: "SauceLabs",
      browserName: "opera",
      platform: "Windows 7"
    },
    {
      base: "SauceLabs",
      browserName: "opera",
      platform: "Linux"
    },
    {
      base: "SauceLabs",
      browserName: "Safari",
      platform: "OS X 10.6",
      version: "5"
    },
    {
      base: "SauceLabs",
      browserName: "Safari",
      platform: "OS X 10.8",
      version: "6"
    },
    {
      base: "SauceLabs",
      browserName: "Safari",
      platform: "OS X 10.9",
      version: "7"
    },
    {
      base: "SauceLabs",
      browserName: "Safari",
      platform: "OS X 10.10",
      //version: "8",
      idleTimeout: 1000,
      commandTimeout: 600
    }
  ],

  /* multiCapabilities: [{
   'browserName': 'phantomjs',
   'phantomjs.binary.path': 'node_modules/phantomjs/bin/phantomjs'
   }, {
   'browserName': 'chrome'
   }, {
   'browserName': 'firefox'
   }],*/

  specs: ['./e2e/**/*Spec.js']
};