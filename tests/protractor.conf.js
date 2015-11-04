exports.config = {

  sauceUser: "NataliSol",
  sauceKey: "b09d8f7f-01cd-403b-a8e5-84fdf39d0efd",

  // seleniumAddress: 'http://localhost:4444/wd/hub',
  // sauceSeleniumAddress: 'http://localhost:4445/wd/hub',

  /*
   getPageTimeout: 600000,
   allScriptsTimeout: 99999,*/

  multiCapabilities: [
    {
      browserName: "Android",
      platform: "Linux",
      version: "4.3",
      name: "Android 4.3"
    },
    {
      browserName: "Android",
      platform: "Linux",
      version: "4.4",
      name: "Android 4.4"
    },
    {
      browserName: "Android",
      platform: "Linux",
      version: "5.0",
      name: "Android 5.0"
    },
    {
      browserName: "Chrome",
      platform: "Windows 8.1",
      name: "Chrome Win 8.1"
    },
    {
      browserName: "Chrome",
      platform: "OS X 10.10",
      name: "Chrome OS X"
    },
    {
      browserName: "Firefox",
      platform: "Windows 8.1",
      name: "Firefox Win 8.1"
    },
    {
      browserName: "Firefox",
      platform: "Linux",
      name: "Firefox Linux"
    },
    {
      browserName: "Firefox",
      platform: "OS X 10.10",
      name: "Firefox OS X"
    },
    {
      browserName: "iPhone",
      platform: "OS X 10.8",
      version: "6.1"
    },
    {
      browserName: "iPhone",
      platform: "OS X 10.9",
      version: "7.1"
    },
    {
      browserName: "iPhone",
      platform: "OS X 10.10",
      version: "8.1"
    },
    {
      browserName: "iphone",
      platform: "OS X 10.10",
      version: "9.0",
      name: "iPad Retina"
    },
    {
      browserName: "opera",
      platform: "Windows 7"
    },
    {
      browserName: "opera",
      platform: "Linux"
    },
    {
      browserName: "Safari",
      platform: "OS X 10.9",
      version: "7"
    },
    {
      browserName: "Safari",
      platform: "OS X 10.10",
      version: "8",
      idleTimeout: 1000,
      commandTimeout: 600
    }
  ],

  specs: ['./e2e/**/*Spec.js']
};