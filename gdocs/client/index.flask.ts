// import `.scss` files
// var $ = import("jquery"); import("jquery-ui");

import "./styles/global";
import "./styles/editor";

import { App } from "./lib/app";
import { LocalStore, JQHttpClient } from "./lib/flask";
import { LocalExtractor } from "./lib/flask";
import { Defaults } from "../defvals";

import { registerApp as wordpress } from "./lib/wordpress/index";

(window as any).BCDefaults = Defaults;

$(function () {
  var store = new LocalStore("BC");
  var httpClient = new JQHttpClient();
  var theApp = new App(store, httpClient);
  theApp.contentExtractor = new LocalExtractor("editor_container");

  wordpress(theApp);
  (window as any).bcApp = theApp;
});

// export default UserList class
// I used `defaultExport` to state that variable name doesn't matter
// export default BCJS;
