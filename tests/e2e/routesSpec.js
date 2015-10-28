//
// test/e2e/routesSpec.js
//
describe("E2E: Testing Routes", function() {

  beforeEach(function() {
    browser().navigateTo('/');
  });

  it('should jump to the /videos path when / is accessed', function() {
    browser().navigateTo('#/tools');
    expect(browser().location().path()).toBe("/tools");
  });


});
