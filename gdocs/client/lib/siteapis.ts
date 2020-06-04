import { App } from "./app";
import { Request, Response} from "./net";
import { Int, Nullable } from "./types";
import { ensureParam } from "./utils";
import { AuthType, AuthConfig, AuthClient } from "./authclients";
import { Store } from "./stores";

export type SiteType = string;

export interface SiteConfig {
  siteType: SiteType;
}

export abstract class SiteApi {
  site: Site;
  authClient: AuthClient;
  app: App;
  constructor(site: Site, authClient: AuthClient, app: App) {
    this.site = site;
    this.authClient = authClient;
    this.app = app;
  }

  abstract createPostRequest(post: Post, options: any): Request;
  abstract updatePostRequest(postid: String, options: any): Request;
  abstract getPostsRequest(options: any): Request;
  abstract removePostRequest(id: any): Request;

  async createPost(post: Post, options: any) {
    var request = this.createPostRequest(post, options);
    request = this.authClient.decorateRequest(request);
    return this.app.httpClient.send(request);
  }
  async updatePost(postid: String, options: any) {
    var request = this.updatePostRequest(postid, options);
    request = this.authClient.decorateRequest(request);
    return this.app.httpClient.send(request);
  }
  async getPosts(options: any): Promise<Post[]> {
    var request = this.getPostsRequest(options);
    request = this.authClient.decorateRequest(request);
    var response = await this.app.httpClient.send(request);
    try {
      return this.processGetPosts(response, options)
    } catch (e) {
      console.log("Get Posts Exception: ", e);
      throw e;
    }
  }
  async removePost(id: any) {
    var request = this.removePostRequest(id);
    request = this.authClient.decorateRequest(request);
    return this.app.httpClient.send(request);
  }

  processGetPosts(response : Response, _options : any) {
    return response.data.map((p: any) => {
      return new Post(p.id, p);
    });
  }
}

export class Post {
  id: Nullable<string>;
  options: any;
  constructor(id: Nullable<string> = null, options: any = null) {
    options = options || {};
    this.id = id;
    this.options = options;
  }

  get payload(): any {
    return {
      id: this.id,
      options: this.options,
    };
  }
}

export class Site {
  readonly id: string;
  title: string;
  siteConfig: SiteConfig;
  authConfig: AuthConfig;
  selectedPost: any = null;

  constructor(title: string, siteConfig: SiteConfig, authConfig: AuthConfig) {
    this.title = title;
    this.siteConfig = siteConfig;
    this.authConfig = authConfig;
    this.id = "" + Date.now();
  }

  get siteType(): SiteType {
    return ensureParam(this.siteConfig, "siteType");
  }

  get authType(): AuthType {
    return ensureParam(this.authConfig, "authType");
  }

  equals(another: Site): boolean {
    return (
      this.id == another.id &&
      this.title == another.title &&
      this.authConfig == another.authConfig &&
      this.siteConfig == another.siteConfig
    );
  }

  get config(): any {
    return {
      id: this.id,
      title: this.title,
      siteConfig: this.siteConfig,
      authConfig: this.authConfig,
    };
  }
}

export class SiteService {
  sites: Site[] = [];
  store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  /**
   * Return the site at the given index.
   */
  siteAt(index: Int): Site {
    return this.sites[index];
  }

  /**
   * Find the index of the site given its ID.
   * Returns the index or -1 if not found.
   */
  indexOf(site: Site): Int {
    for (var i = this.sites.length - 1; i >= 0; i--) {
      if (this.sites[i].equals(site)) {
        return i;
      }
    }
    return -1;
  }

  async saveSite(_site: Site) {
    return this.saveAll();
  }

  async clear() {
    this.sites = [];
    this.saveAll();
  }

  async saveAll() {
    var configs = this.sites.map((site: Site) => {
      return site.config;
    });
    return this.store.set("sites", configs);
  }

  async loadAll() {
    var sites = (await this.store.get("sites")) || [];
    this.sites = sites.map(function (data: any, _index: Int) {
      return new Site(data.title, data.siteConfig, data.authConfig);
    });

    return true;
  }

  /**
   * Add a new site.
   */
  async addSite(site: Site) {
    var index = this.indexOf(site);
    if (index >= 0) {
      this.sites[index] = site;
    } else {
      index = this.sites.length;
      this.sites.push(site);
    }
    await this.saveAll();
    return index;
  }

  async remove(site: Site) {
    var index = this.indexOf(site);
    return this.removeAt(index);
  }

  /**
   * Removes the site at a given index and returns it.
   */
  async removeAt(index: Int) {
    if (index < 0) {
      return null;
    } else {
      var site: Site = this.sites.splice(index, 1)[0];
      // await this.saveSiteIds();
      // await this.store.remove("site:" + site.id);
      await this.saveAll();
      return site;
    }
  }
}
