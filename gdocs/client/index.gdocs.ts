import "./styles/global";

import { App } from "./lib/app";
import { PropertiesStore, GAppsHttpClient } from "./lib/gapps";
import { GAppsExtractor } from "./lib/gapps";
import { Defaults } from "../defvals";
import { registerApp as wordpress } from "./lib/wordpress/index";
import { registerApp as medium } from "./lib/medium/index";
import { registerApp as loginauth } from "./lib/loginauth/index";
import { registerApp as tokenauth } from "./lib/tokenauth/index";
import { registerApp as oauth2auth } from "./lib/oauth2/index";

import { parseQP } from "./lib/utils";
(window as any).parsedQueryParams = parseQP(window.location.search);

const SCRIPT_ID = "1xRQEya-JbepQemUQT7cxV4JzF6MGoinzNtn_FsvPZlJw48xNm1Xd9BM_";
(window as any).redirectUriForSite = (site: string) => {
  return (
    "https://script.google.com/macros/d/" +
    SCRIPT_ID +
    "/oauth2callback/" +
    site
  );
};
(window as any).OAUTH2_REDIRECT_URI = (window as any).BCDefaults = Defaults;

$(function () {
  var store = new PropertiesStore("BC");
  var httpClient = new GAppsHttpClient();
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
