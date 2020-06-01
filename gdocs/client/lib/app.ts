// import "webpack-jquery-ui/button";
// import "webpack-jquery-ui/css";
import { SitesPanel } from "./ui/SitesPanel";
import { AuthDetailView } from "./ui/AuthDetailViews"
import { HttpClient } from "./net";
import { View } from "./ui/Views";
import { Store } from "./stores";
import { ContentExtractor } from "./extractors";
import { AuthResult, AuthConfig, AuthClient } from "./authclients";
import {
  SiteService,
  Site,
  Post,
  SiteType,
  SiteConfig,
  SiteApi,
} from "./siteapis";
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

export interface ClientFactory<ConfigType, ValueType> {
  (config: Nullable<ConfigType>): ValueType;
}

export interface ViewFactory<ValueType, ViewType = View<ValueType>> {
  (purpose: string, elem_or_id: any, config: Nullable<ValueType>): ViewType
}

export class App {
  store: Store;
  siteService: SiteService;
  httpClient: HttpClient;
  contentExtractor: ContentExtractor;
  sitesPanel: SitesPanel;
  siteApiFactories: {
    [siteType: string]: ClientFactory<SiteConfig, SiteApi>;
  } = {};
  siteViewFactories: {
    [siteType: string]: ViewFactory<Site>;
  } = {};
  authClientFactories: {
    [siteType: string]: ClientFactory<AuthConfig, AuthClient>;
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

  createSiteApi(siteType: SiteType, siteConfig: Nullable<SiteConfig>) {
    return this.siteApiFactories[siteType](siteConfig);
  }

  createSiteView(
    siteType: string,
    purpose: string,
    elem_or_id: any,
    entity: Nullable<Site>
  ) {
    return this.siteViewFactories[siteType](purpose, elem_or_id, entity);
  }

  createAuthClient(authType: string, entity: Nullable<AuthConfig>) {
    return this.authClientFactories[authType](entity);
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
      var authClient = this.createAuthClient(site.authType, site.authConfig);
      if (await authClient.validateAuth()) return true;

      // if we are not logged in then start the auth flow - This could involve
      // showing responding UIs to gather credentials etc.
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

  async createPost(site: Site, post: Post, options: any) {
    var siteApi = this.createSiteApi(site.siteType, site.siteConfig);
    var request = siteApi.createPostRequest(post, options);
    var authClient = this.createAuthClient(site.authType, site.authConfig);
    request = authClient.decorateRequest(request);
    return this.httpClient.send(request);
  }
  async updatePost(site: Site, postid: String, options: any) {
    var siteApi = this.createSiteApi(site.siteType, site.siteConfig);
    var request = siteApi.updatePostRequest(postid, options);
    var authClient = this.createAuthClient(site.authType, site.authConfig);
    request = authClient.decorateRequest(request);
    return this.httpClient.send(request);
  }
  async getPosts(site: Site, options: any): Promise<Post[]> {
    var siteApi = this.createSiteApi(site.siteType, site.siteConfig);
    var request = siteApi.getPostsRequest(options);
    var authClient = this.createAuthClient(site.authType, site.authConfig);
    request = authClient.decorateRequest(request);
    var response = await this.httpClient.send(request);
    try {
      return response.data.map((p: any) => {
        return new Post(p.id, p);
      });
    } catch (e) {
      console.log("Get Posts Exception: ", e);
      throw e;
    }
  }
  async removePost(site: Site, id: any) {
    var siteApi = this.createSiteApi(site.siteType, site.siteConfig);
    var request = siteApi.removePostRequest(id);
    var authClient = this.createAuthClient(site.authType, site.authConfig);
    request = authClient.decorateRequest(request);
    return this.httpClient.send(request);
  }
}
