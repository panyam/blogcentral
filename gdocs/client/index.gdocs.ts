import "./styles/global";

import { App } from "./lib/app";
import { PropertiesStore, GAppsHttpClient } from "./lib/gapps";
import { GAppsExtractor } from "./lib/gapps";
import { Defaults } from "../defvals"
// import { JQHttpClient } from "./lib/flask";

$(function () {
  var store = new PropertiesStore("BC");
  var httpClient = new GAppsHttpClient();
  // var httpClient = new JQHttpClient();
  var theApp = new App(store, httpClient);
  theApp.contentExtractor = new GAppsExtractor();
  (window as any).bcApp = theApp;
});

// export default UserList class
// I used `defaultExport` to state that variable name doesn't matter
// export default BCJS;
