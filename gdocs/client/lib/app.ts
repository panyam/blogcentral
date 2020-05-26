// import "webpack-jquery-ui/button";
// import "webpack-jquery-ui/css";
import { SitesPanel } from "./ui/SitesPanel";
import { HttpClient } from "./net";
import { Store } from "./stores";
import { ContentExtractor } from "./extractors";
import { SiteService, Site, Post } from "./models";
import { AuthResult, createAuthClient } from "./authclients";
import { createSiteApi } from "./siteapis";

declare var Handlebars: any;
Handlebars.registerHelper("eitherVal", function (
  value: any,
  defaultValue: any
) {
  var out = value || defaultValue;
  return new Handlebars.SafeString(out);
});

export class App {
  store: Store;
  siteService: SiteService;
  httpClient: HttpClient;
  contentExtractor: ContentExtractor;
  sitesPanel: SitesPanel;

  constructor(store: Store, httpClient: HttpClient) {
    this.store = store;
    this.httpClient = httpClient;
    this.siteService = new SiteService(store);
    this.sitesPanel = new SitesPanel("sites_panel_div", this);
  }

  /**
   * Ensures that a site is logged into so that all api calls
   * to a site are authenticated by coordinating a site's auth client
   * with a UI specific to the AuthType to kick off flows and obtaining
   * credentials and saving the results into the site.
   */
  async ensureLoggedIn(site: Site) {
    while (true) {
      var authClient = createAuthClient(site.authType, this, site.authConfig);
      if (await authClient.validateAuth(site)) return true;

      // if we are not logged in then start the auth flow - This could involve
      // showing responding UIs to gather credentials etc.
      var result = await authClient.startAuthFlow(site);
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
    var siteApi = createSiteApi(site.siteType, site.siteConfig);
    var request = siteApi.createPostRequest(post, options);
    return this.httpClient.send(request);
  }
  async updatePost(site: Site, postid: String, options: any) {
    var siteApi = createSiteApi(site.siteType, site.siteConfig);
    var request = siteApi.updatePostRequest(postid, options);
    return this.httpClient.send(request);
  }
  async getPosts(site: Site, options: any): Promise<Post[]> {
    var siteApi = createSiteApi(site.siteType, site.siteConfig);
    var request = siteApi.getPostsRequest(options);
    try {
      var response = await this.httpClient.send(request);
      return response.data.map((p: any) => {
        return new Post(p.id, p);
      });
    } catch (e) {
      console.log("Get Posts Exception: ", e);
      throw e;
    }
  }
  async removePost(site: Site, id: any) {
    var siteApi = createSiteApi(site.siteType, site.siteConfig);
    var request = siteApi.removePostRequest(id);
    return this.httpClient.send(request);
  }
}
