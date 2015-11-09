describe('tools', function () {
  afterEach(function () {
    browser.ignoreSynchronization = false;
    browser.manage().logs().get('browser').then(function (browserLog) {
      for (var i = 0; i < browserLog.length; i++) {
        expect(browserLog[i].message).not.toMatch(/^(Error)$/);
      }
    });
  });

  it('mountain', function () {
    browser.ignoreSynchronization = true;
    browser.get('http://gapminder.org/tools/mountain', 30000);
  });

});