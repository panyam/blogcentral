// import "webpack-jquery-ui/button";
// import "webpack-jquery-ui/css";
import { SitesPanel } from "./ui/SitesPanel";
import { AuthDetailView } from "./ui/AuthDetailViews";
import { HttpClient } from "./net";
import { View } from "./ui/Views";
import { Store } from "./stores";
import { ContentExtractor } from "./extractors";
import { AuthResult, AuthConfig, AuthClient } from "./authclients";
import { SiteService, Site, SiteApi } from "./siteapis";
import { Nullable } from "./types";

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

export interface SiteApiFactory {
  (site: Site, authClient: AuthClient, app: App): SiteApi;
}

export interface AuthClientFactory {
  (config: AuthConfig): AuthClient;
}

export interface ViewFactory<ValueType, ViewType = View<ValueType>> {
  (purpose: string, elem_or_id: any, config: Nullable<ValueType>): ViewType;
}

export class App {
  store: Store;
  siteService: SiteService;
  httpClient: HttpClient;
  contentExtractor: ContentExtractor;
  sitesPanel: SitesPanel;
  siteApiFactories: {
    [siteType: string]: SiteApiFactory;
  } = {};
  authClientFactories: {
    [authType: string]: AuthClientFactory;
  } = {};
  siteViewFactories: {
    [siteType: string]: ViewFactory<Site>;
  } = {};
  authViewFactories: {
    [authType: string]: ViewFactory<AuthConfig, AuthDetailView>;
  } = {};

  constructor(store: Store, httpClient: HttpClient) {
    this.store = store;
    this.httpClient = httpClient;
    this.siteService = new SiteService(store);
    this.sitesPanel = new SitesPanel("sites_panel_div", this);

    // register things!
    // import wp from "./wordpress/index";

    // this should register 2 suites with each suite containing:
    //  0. SiteType that will act as the grouping for everything about this Site class
    //  1. A SiteApi representing the kind of site.
    //  2. A SiteInputView - for showing a UI that can input data for hte Site
    //  3. A SiteSummaryView - for showing a UI for summarizing a site in a cell
    // wp.register(this);
  }

  createAuthClient(authType: string, entity: AuthConfig) {
    return this.authClientFactories[authType](entity);
  }

  authClientForSite(site: Site): AuthClient {
    var s = site as any;
    if (!s.authClient) {
      s.authClient = this.createAuthClient(site.authType, site.authConfig);
    }
    return s.authClient as AuthClient;
  }

  apiForSite(site: Site): SiteApi {
    var s = site as any;
    if (!s.siteApi) {
      s.siteApi = this.createSiteApi(site);
    }
    return s.siteApi as SiteApi;
  }

  createSiteApi(site: Site) {
    var ac = this.authClientForSite(site);
    return this.siteApiFactories[site.siteType](site, ac, this);
  }

  createSiteView(
    siteType: string,
    purpose: string,
    elem_or_id: any,
    entity: Nullable<Site>
  ) {
    return this.siteViewFactories[siteType](purpose, elem_or_id, entity);
  }

  createAuthView(
    authType: string,
    purpose: string,
    elem_or_id: any,
    entity: Nullable<AuthConfig>
  ) {
    return this.authViewFactories[authType](purpose, elem_or_id, entity);
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
      if (await authClient.validateAuth()) return true;

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
