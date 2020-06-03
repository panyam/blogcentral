// import `.scss` files
// var $ = import("jquery"); import("jquery-ui");

import "./styles/global";
import "./styles/editor";

import { App } from "./lib/app";
import { LocalStore, JQHttpClient } from "./lib/flask";
import { LocalExtractor } from "./lib/flask";
import { Defaults } from "../defvals";

import { registerApp as wordpress } from "./lib/wordpress/index";
import { registerApp as medium } from "./lib/medium/index";
import { registerApp as loginauth } from "./lib/loginauth/index";
import { registerApp as tokenauth } from "./lib/tokenauth/index";
import { registerApp as oauth2auth } from "./lib/oauth2/index";

import { parseCookies } from "./lib/utils";
(window as any).ParsedCookies = parseCookies();

(window as any).redirectUriForSite = (site: string) => {
  return (
    window.location.protocol +
    "//" +
    window.location.host +
    "/oauth2/" +
    site +
    "/redirect"
  );
};
(window as any).BCDefaults = Defaults;

$(function () {
  var store = new LocalStore("BC");
  var httpClient = new JQHttpClient();
  var theApp = new App(store, httpClient);
  theApp.contentExtractor = new LocalExtractor("editor_container");
  (window as any).bcApp = theApp;

  // register plugins
  wordpress(theApp);
  medium(theApp);
  loginauth(theApp);
  tokenauth(theApp);
  oauth2auth(theApp);
});

// export default UserList class
// I used `defaultExport` to state that variable name doesn't matter
// export default BCJS;
