
var testsContext = require.context(".", true, /_test$/);
testsContext.keys().forEach(testsContext);
/*
describe('tools', function () {

 it('should add a todo', function () {
    //browser.get('http://localhost:8080/tools/bubbles');
    //window.location = 'http://www.gapminder.org/tools/bubbles';

  });

});*/


describe('TestSuite', function() {
 console.log('browser:', window);
});

