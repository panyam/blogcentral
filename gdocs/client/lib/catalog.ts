import { Store } from "./stores";
import { HttpClient } from "./net";
import { SiteService, Site, Post } from "./sites";
import { ContentExtractor } from "./extractors";

export interface SiteLoginProvider {
  ensureLoggedIn(site: Site): Promise<boolean>;
}

export class ServiceCatalog {
  store: Store;
  siteService: SiteService;
  httpClient: HttpClient;
  contentExtractor: ContentExtractor;
  siteLoginProvider: SiteLoginProvider;

  constructor(store: Store, httpClient: HttpClient) {
    this.store = store;
    this.httpClient = httpClient;
    this.siteService = new SiteService(store);
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
