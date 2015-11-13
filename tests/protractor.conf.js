exports.config = {

   sauceUser: "NataliSol",
   sauceKey: "b09d8f7f-01cd-403b-a8e5-84fdf39d0efd",
  // seleniumAddress: 'http://localhost:4444/wd/hub',

  multiCapabilities: [
    {
      browserName: "Android",
      shardTestFiles: true,
      platform: "Linux",
      version: "4.3",
      name: "Android 4.3",
      public: 'public',
      build: "build-1"
    },
    {
      browserName: "Android",
      shardTestFiles: true,
      platform: "Linux",
      version: "5.0",
      name: "Android 5.0",
      public: 'public',
      build: "build-2"

    },
    {
      browserName: "Android",
      platform: "Linux",
      version: "4.4",
      name: "Android 4.4",
      public: 'public',
      build: "build-3"
    },


    {
      browserName: "Chrome",
      platform: "Windows 8.1",
      name: "Chrome Win 8.1",
      public: 'public',
      build: "build-5"
    },
    {
      browserName: "Chrome",
      platform: "OS X 10.10",
      name: "Chrome OS X",
      public: 'public',
      build: "build-6"
    },
    {
      browserName: "Firefox",
      platform: "Windows 8.1",
      name: "Firefox Win 8.1",
      public: 'public',
      build: "build-7"
    },
    {
      browserName: "Firefox",
      platform: "Linux",
      name: "Firefox Linux",
      build: "build-8"
    },
    {
      browserName: "Firefox",
      platform: "OS X 10.10",
      name: "Firefox OS X",
      public: 'public',
      build: "build-9"
    },
    {
      browserName: "Firefox",
      platform: "Windows 7",
      version: "41.0",
      name: "Firefox Win 7",
      public: 'public',
      build: "build-10"
    },

    {
      browserName: "opera",
      platform: "Windows 7",
      name: "opera Win 7",
      public: 'public',
      build: "build-11"
    },
    {
      browserName: "opera",
      platform: "Linux",
      name: "opera Linux",
      public: 'public',
      build: "build-12"
    },
    {
      browserName: "Safari",
      platform: "OS X 10.9",
      version: "7",
      name: "Safari 7",
      maxDuration: 10800,
      idleTimeout: 1000,
      commandTimeout: 600,
      public: 'public',
      build: "build-13"
    },
    {
      browserName: "Safari",
      platform: "OS X 10.10",
      version: "8",
      name: "Safari 8",
      shardTestFiles: true,
      maxDuration: 10800,
      idleTimeout: 1000,
      commandTimeout: 600,
      public: 'public',
      build: "build-14"
    },
    {
      browserName: "Safari",
      platform: "OS X 10.11",
      version: "9.0",
      name: "Safari 9",
      shardTestFiles: true,
      maxDuration: 10800,
      idleTimeout: 1000,
      commandTimeout: 600,
      public: 'public',
      build: "build-18"
    },
    {
      browserName: 'Safari',
      'appiumVersion': '1.4.14',
      deviceName: 'iPhone 6',
      deviceOrientation: 'portrait',
      shardTestFiles: true,
      platformVersion: '8.0',
      platformName: 'iOS',
      idleTimeout: 1000,
      commandTimeout: 600,
      public: 'public',
      name: "iPhone v8.0"
    },
    {
      browserName: 'Safari',
      'appiumVersion': '1.4.13',
      deviceName: 'iPhone 6',
      shardTestFiles: true,
      deviceOrientation: 'portrait',
      platformVersion: '8.1',
      platformName: 'iOS',
      idleTimeout: 1000,
      commandTimeout: 600,
      public: 'public',
      name: "iPhone v8.1"
    },
    {
      browserName: 'Safari',
      'appiumVersion': '1.4.14',
      deviceName: 'iPhone 6',
      shardTestFiles: true,
      deviceOrientation: 'portrait',
      platformVersion: '8.2',
      maxDuration: 10800,
      platformName: 'iOS',
      idleTimeout: 1000,
      commandTimeout: 600,
      public: 'public',
      name: "iPhone v8.2"
    },
    {
      browserName: 'Safari',
      'appiumVersion': '1.4.14',
      deviceName: 'iPhone 6',
      shardTestFiles: true,
      deviceOrientation: 'portrait',
      platformVersion: '8.3',
      platformName: 'iOS',
      idleTimeout: 1000,
      commandTimeout: 600,
      public: 'public',
      name: "iPhone v8.3"
    },
    {
      browserName: 'Safari',
      'appiumVersion': '1.4.14',
      deviceName: 'iPhone 6',
      shardTestFiles: true,
      deviceOrientation: 'portrait',
      platformVersion: '8.4',
      duration: 400000,
      platformName: 'iOS',
      idleTimeout: 1000,
      commandTimeout: 600,
      public: 'public',
      name: "iPhone v8.4"
    }
  ],
  desiredCapabilities: [
    {
      browserName: 'Safari',
      'appiumVersion': '1.4.14',
      deviceName: 'iPhone 6',
      shardTestFiles: true,
      deviceOrientation: 'portrait',
      platformVersion: '9.0',
      maxDuration: 10800,
      platformName: 'iOS',
      idleTimeout: 1000,
      commandTimeout: 600,
      public: 'public',
      name: "iPhone v9.0"
    }
  ],
  allScriptsTimeout: 11000,

  getPageTimeout: 10000,

  specs: ['./e2e/**/*Spec.js']
};
