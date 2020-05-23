// import "webpack-jquery-ui/button";
// import "webpack-jquery-ui/css";
import { SitesPanel } from "./ui/SitesPanel";
import { Store, HttpClient, ContentExtractor  } from "./interfaces";
import { SiteService, Site, Post } from "./sites";

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
  async ensureLoggedIn(site : Site) {
      /*
    while (true) {
      site.config.token = site.config.token || null;
      if (site.config.token == null) {
        this.site = site;
        var credentials: any = await this.open();
        if (credentials == null) return false;
        try {
          site.config.token = await gateway.loginToWordpress(site, credentials);
          this.close();
          if (site.config.token == null) {
            // cancelled
            return false;
          } else {
            site.config.tokenTimestamp = Date.now();
            // Save what we have so far
            await this.services.siteService.saveSite(site);
          }
        } catch (e) {
          console.log("Received Exception: ", e);
          var resjson = e.responseJSON || {};
          var message = resjson.message || e.statusText;
          this.errorMessage = message;
        }
      }

      if (site.config.token != null) {
        // validate token if too old needed
        var validatedDelta = Date.now() - (site.config.tokenValidatedAt || 0);
        if (validatedDelta > TOKEN_VALIDATION_FREQUENCY) {
          var validated = await gateway.validateToken(site);
          if (validated) {
            await this.services.siteService.saveSite(site);
            return true;
          } else {
            // validation failed - may be token is invalid
            site.config.token = null;
          }
        } else {
          return true;
        }
      }
    }
   */
    return true;
  }

  async createPost(site: Site, post: Post, options: any) {
    var request = site.siteApi.createPostRequest(post, options);
    return this.httpClient.send(request);
  }
  async updatePost(site: Site, postid: String, options: any) {
    var request = site.siteApi.updatePostRequest(postid, options);
    return this.httpClient.send(request);
  }
  async getPosts(site: Site, options: any): Promise<Post[]> {
    var request = site.siteApi.getPostsRequest(options);
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
    var request = site.siteApi.removePostRequest(id);
    return this.httpClient.send(request);
  }
}
