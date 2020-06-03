import "./styles/global";

import { App } from "./lib/app";
import { PropertiesStore, GAppsHttpClient } from "./lib/gapps";
import { GAppsExtractor } from "./lib/gapps";
import { Defaults } from "../defvals"
// import { JQHttpClient } from "./lib/flask";
import { registerApp as wordpress } from "./lib/wordpress/index";
import { registerApp as medium } from "./lib/medium/index";
import { registerApp as loginauth } from "./lib/loginauth/index";
import { registerApp as tokenauth } from "./lib/tokenauth/index";
import { registerApp as oauth2auth } from "./lib/oauth2/index";

const SCRIPT_ID = "1xRQEya-JbepQemUQT7cxV4JzF6MGoinzNtn_FsvPZlJw48xNm1Xd9BM_";
(window as any).OAUTH2_REDIRECT_URI =
"https://script.google.com/macros/d/" + SCRIPT_ID + "/usercallback";
(window as any).BCDefaults = Defaults;

$(function () {
  var store = new PropertiesStore("BC");
  var httpClient = new GAppsHttpClient();
  // var httpClient = new JQHttpClient();
  var theApp = new App(store, httpClient);
  theApp.contentExtractor = new GAppsExtractor();
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
