//////////// Helper utility functions

import { DefaultProperties } from "./Defaults";

export function loadDocProperties() {
  var properties: any = null;
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

export function saveDocProperties(newProperties: any) {
  var out: any = {};
  for (var key in newProperties) {
    var value = newProperties[key];
    out[key] = JSON.stringify(value);
  }
  var docProps = PropertiesService.getDocumentProperties();
  docProps.setProperties(out, false);
}

export function getUserProperty(key: string) {
  var properties = PropertiesService.getUserProperties();
  return properties.getProperty(key);
}

export function setUserProperty(key: string, value: string) {
  var properties = PropertiesService.getUserProperties();
  properties.setProperty(key, value);
}

export function urlfetch(url: string, options: any) {
  var response = UrlFetchApp.fetch(url, options);
  var respText = response.getContentText();

  // var data = response.getContent();
  // var b2s = String.fromCharCode.apply(String, response.data);
  // var parsed = JSON.parse(b2s);
  var parsed = JSON.parse(respText);
  var out = {
    status: response.getResponseCode(),
    data: parsed,
    headers: response.getAllHeaders(),
  };
  return out;
}

export function getGoogleDocumentAsHTML(id: string) {
  DriveApp.getStorageUsed(); //needed to get Drive Scope requested
  var url =
    "https://docs.google.com/feeds/download/documents/export/Export?id=" +
    id +
    "&exportFormat=html";
  var param: any = {
    method: "get",
    headers: { Authorization: "Bearer " + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true,
  };
  var html = UrlFetchApp.fetch(url, param).getContentText();
  Logger.log(html);
  return html;
}
