chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('./tools/index.html', {
    'outerBounds': {
      'width': 1200,
      'height': 800
    }
  });
});
