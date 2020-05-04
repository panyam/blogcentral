
//////////// Helper utility functions

var CURRENT_USER_TZ_OFFSET = new Date().getTimezoneOffset();
var DOCUMENT_TIMEZONE = null;

function getDocumentTimeZone() {
    if (DOCUMENT_TIMEZONE == null) {
        DOCUMENT_TIMEZONE = DocumentApp.getActiveSpreadsheet().getSpreadsheetTimeZone();
    }
    return DOCUMENT_TIMEZONE;
}

function loadDocProperties() {
  var properties = null;
  var docProps = PropertiesService.getDocumentProperties();
  var allProperties = docProps.getProperties();
  // Logger.log("All Properties: ", allProperties);
  for (var key in DefaultProperties) {
    var value = allProperties[key] || null;
    if (value != null) {
      value = JSON.parse(value);
      if (properties == null) properties = {};
      properties[key] = value || DefaultProperties[key];
    }
  }
  return properties;
}

function saveDocProperties(newProperties) {
  var out = {};
  for (var key in newProperties) {
    var value = newProperties[key];
    out[key] = JSON.stringify(value)
  }
  var docProps = PropertiesService.getDocumentProperties();
  docProps.setProperties(out, false);
}

function getUserProperty(key) {
    var properties = PropertiesService.getUserProperties();
    return properties.getProperty(key);
}

function setUserProperty(key, value) {
    var properties = PropertiesService.getUserProperties();
    properties.setProperty(key, value);
}

function urlfetch(url, options) {
    // TODO: Remove after dev
    console.log("UrlFetch, URL: ", url);
    console.log("UrlFetch, Options: ", options);
    var response = UrlFetchApp.fetch(url, options);
    var respText = response.getContentText()
    console.log("UrlFetch, Response: ", respText);
    // var data = response.getContent();
    // var b2s = String.fromCharCode.apply(String, response.data);
    // var parsed = JSON.parse(b2s);
    var parsed = JSON.parse(respText);
    var out = {
        'status': response.getResponseCode(),
        'data': parsed,
        'headers': response.getAllHeaders()
    };
    return out;
}
