describe('tools', function () {
  /*beforeEach(function () {
   module('app');
   });*/

  afterEach(function () {
    browser.manage().logs().get('browser').then(function (browserLog) {
      for (var i = 0; i < browserLog.length; i++) {
        expect(browserLog[i].message).not.toMatch(/Error/);
      }
    });
  });

  it('should add a todo', function () {
    browser.get('http://localhost:8080/tools/bubbles');
  });

});