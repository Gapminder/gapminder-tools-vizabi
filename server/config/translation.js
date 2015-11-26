var spaceId = "we1a0j890sea";
var accessToken = "7e33820119e63f72f286be1f474e89be6eafc4af751b2e91b93f130abc5a20a1";
var translationEntryId = "3lnTh2Y6pyaKUom28mKqAw";

var translationMap = {
  'en': 'en-US',
  'se': 'sv'
};

module.exports = function(language) {
  return getTranslationUrl(language);
};

function getTranslationUrl(language) {
  return "https://cdn.contentful.com/spaces/" + spaceId +
    "/entries/" + translationEntryId + "?access_token=" + accessToken +
    " &locale=" + translationMap[language];
}
