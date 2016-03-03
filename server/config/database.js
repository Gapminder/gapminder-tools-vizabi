var defaultUrl = 'mongodb://localhost:27017/gapminder-tools';
var envUrl = process.env.MONGO_URL;
module.exports = {
  // the database url to connect
  url: envUrl || defaultUrl
};
