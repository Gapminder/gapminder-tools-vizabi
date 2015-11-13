describe('tools', function () {
  afterEach(function () {
    browser.ignoreSynchronization = false;
    browser.getCapabilities().then(function (cap) {
      browser.browserName = cap.caps_.browserName;
      if (browser.browserName === 'iOS') {
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


  it('mountain', function () {
    browser.ignoreSynchronization = true;
    browser.get('http://gapminder.org/tools/mountain');
    browser.sleep(5000);
  });

});