var liveServer = require("live-server");

var params = {
  port: 3001,
  host: "localhost",
  root: "client/dist",
  open: false,
  file: "/tools/index.html"
};

liveServer.start(params);
