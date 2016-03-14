module.exports = {
  port: 3001,
  server: {
    baseDir: "./client/dist",
    middleware: {
      0: null,
      1: require('connect-history-api-fallback')({index: '/tools/index.html'})
    }
  },
  ui: false,
  snippetOptions: {
    rule: {
      //workaround for browser-sync to not inject script for push changes listening
      match: /qqqqqqqqq/
    }
  },
  codeSync: false
};
