describe('tools', function () {
  afterEach(function () {
    browser.manage().logs().get('browser').then(function (browserLog) {
      for (var i = 0; i < browserLog.length; i++) {
        expect(browserLog[i].message).not.toMatch(/Error/);
      }
    });
  });

  it('bubbles & mountain', function () {
    var browser2 = browser.forkNewDriverInstance();
    var browser3 = browser.forkNewDriverInstance();
    browser.get('http://localhost:8080/tools/bubbles');
    browser2.get('http://localhost:8080/tools/mountain');
    browser3.get('http://localhost:8080/tools');
  });

});