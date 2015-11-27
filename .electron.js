var DEFAULT_LOAD_URL =  (process.env.HOST_URL || 'http://localhost') + ':' + (process.env.PORT || 3001);
var LOAD_URL =  process.env.LOAD_URL ? process.env.LOAD_URL : DEFAULT_LOAD_URL;

var app = require('app');  // Module to control application life.
//var ipc = require('ipc');
var BrowserWindow = require('browser-window');  // Module to create native browser window.
//require('electron-cookies');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    'min-width': 800,
    'min-height': 200,
    'accept-first-mouse': true,
    'title-bar-style': 'hidden'
  });

  // and load the index.html of the app.
  mainWindow.loadUrl(LOAD_URL + '/tools/index.html');

  // Open the DevTools.
  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools();
  }

  mainWindow.focus();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
