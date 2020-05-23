// import `.scss` files
// var $ = import("jquery"); import("jquery-ui");

import "./styles/global";
import "./styles/editor";

import { BCJS } from "./lib/index";
import { LocalStore, JQHttpClient } from "./lib/flask";
import { LocalExtractor } from "./lib/flask";

$(function () {
  var store = new LocalStore("BC");
  var httpClient = new JQHttpClient();
  var theApp = new BCJS.App.App(store, httpClient);
  theApp.contentExtractor = new LocalExtractor("editor_container");
  (window as any).bcApp = theApp;
});

// export default UserList class
// I used `defaultExport` to state that variable name doesn't matter
// export default BCJS;
