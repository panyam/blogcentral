// import "webpack-jquery-ui/button";
// import "webpack-jquery-ui/css";
import { SitesPanel } from "./ui/SitesPanel";
import { PostsPanel } from "./ui/PostsPanel";
import { HttpClient } from "./net";
import { EventHub } from "./events";
import { Store } from "./stores";
import { ContentExtractor } from "./extractors";
import {
  AuthType,
  AuthResult,
  AuthConfig,
  AuthClient,
  AuthManager,
} from "./authclients";
import { SiteType, SiteService, Site, SiteManager } from "./siteapis";

declare var Handlebars: any;
Handlebars.registerHelper("eachInMap", function (map: any, block: any) {
  var out = "";
  if (map) {
    Object.keys(map).map(function (prop) {
      out += block.fn({ key: prop, value: map[prop] });
    });
  }
  return out;
});
Handlebars.registerHelper("eitherVal", function (
  value: any,
  defaultValue: any
) {
  var out = value || defaultValue;
  return new Handlebars.SafeString(out);
});

export interface AuthClientFactory {
  (config: AuthConfig): AuthClient;
}

export class App {
  eventHub = new EventHub();
  store: Store;
  siteService: SiteService;
  httpClient: HttpClient;
  contentExtractor: ContentExtractor;
  sitesPanel: SitesPanel;
  postsPanel: PostsPanel;
  siteManagers: {
    [siteType: string]: SiteManager;
  } = {};
  authManagers: {
    [authType: string]: AuthManager;
  } = {};

  constructor(store: Store, httpClient: HttpClient) {
    this.store = store;
    this.httpClient = httpClient;
    this.siteService = new SiteService(store);
    this.sitesPanel = new SitesPanel("sites_panel_div", this);
    this.postsPanel = new PostsPanel("posts_panel_div", this);
  }

  managerForSite(siteType: SiteType): SiteManager {
    return this.siteManagers[siteType];
  }

  managerForAuth(authType: AuthType): AuthManager {
    return this.authManagers[authType];
  }

  authClientForSite(site: Site): AuthClient {
    var s = site as any;
    if (!s.authClient) {
      var authManager = this.authManagers[site.authType];
      s.authClient = authManager.createAuthClient(site.authConfig);
    }
    return s.authClient as AuthClient;
  }

  /**
   * Ensures that a site is logged into so that all api calls
   * to a site are authenticated by coordinating a site's auth client
   * with a UI specific to the AuthType to kick off flows and obtaining
   * credentials and saving the results into the site.
   */
  async ensureLoggedIn(site: Site) {
    while (true) {
      var authClient = this.authClientForSite(site);
      var authValidated = await authClient.validateAuth();
      if (authValidated) return true;

      // if we are not logged in then start the auth flow -
      // This could involve showing responding UIs to gather
      // credentials etc.
      var result = await authClient.startAuthFlow();
      if (result == AuthResult.CANCELLED) {
        console.log("Login Cancelled");
        return false;
      } else if (result == AuthResult.SUCCESS) {
        await this.siteService.saveSite(site);
        return true;
      }
    }
  }
}
