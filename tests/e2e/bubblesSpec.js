describe('tools', function () {
  afterEach(function () {
    browser.ignoreSynchronization = false;
    browser.getCapabilities().then(function (cap) {
      browser.browserName = cap.caps_.browserName;
      if (browser.browserName === 'safari' || browser.browserName === 'iOS') {
        browser.manage().logs().get('crashlog').then(function (browserLog) {
          for (var i = 0; i < browserLog.length; i++) {
            expect(browserLog[i].message).not.toMatch(/^(Error)$/);
          }
        });
      } else {
        browser.manage().logs().get('browser').then(function (browserLog) {
          for (var i = 0; i < browserLog.length; i++) {
            expect(browserLog[i].message).not.toMatch(/^(Error)$/);
          }
        });
      }
    });

  });

  it('bubbles', function () {
    browser.ignoreSynchronization = true;
    browser.get('http://gapminder.org/tools/bubbles');
  });

});