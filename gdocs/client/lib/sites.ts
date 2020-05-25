import { Int, Nullable } from "./types";
import { Request, URLBuilder } from "./net";
import { Store, AuthClient, SiteType, AuthType, SiteApi } from "./interfaces";
import { ensureParam } from "./utils";
import { createAuthClient, JWTAuthClient } from "./auth";

export function createSiteApi(
  siteType: SiteType,
  name: string,
  configs: any
): SiteApi {
  if (siteType == SiteType.WORDPRESS) {
    return new WPRestApi(name, configs);
  } else if (siteType == SiteType.MEDIUM) {
    return new MediumApi(name, configs);
  } else if (siteType == SiteType.LINKEDIN) {
    return new LinkedInApi(name, configs);
  } else {
    throw new Error("SiteType not supported yet");
  }
}

export class WPRestApi extends SiteApi {
  apiUrl: string;
  constructor(name: string, config: any) {
    super(name, config);
    this.apiUrl = ensureParam(config, "apiUrl");
  }

  static defaultConfig() {
    return {
      apiUrl: "https://example.com",
    };
  }

  newRequest(path: string, params: any = null): Request {
    params = params || {};
    var url = new URLBuilder(this.apiUrl).appendPath(path).build();
    var request = new Request(url, {
      contentType: "application/json",
    });
    return request;
  }

  createPostRequest(post: Post, options: any = null) {
    options = options || {};
    var path = "/wp/v2/posts/";
    var request = this.newRequest(path);
    request.options.method = "post";
    request.body = {};
    request.body.title = options.title || post.options.title;
    request.body.password = options.password || post.options.password;
    request.body.excerpt = options.excerpt || post.options.excerpt;
    request.body.comment_status = options.comment_status || "closed";
    request.body.ping_status = options.ping_status || "closed";
    request.body.status = options.status || "draft";
    request.body.content = options.content || "<h1>Hello World</h1>";
    return request;
  }

  updatePostRequest(postid: String, options: any = null) {
    var path = "/wp/v2/posts/" + postid;
    options = options || {};
    var request = this.newRequest(path);
    request.options.method = "post";
    request.body = {};
    if (options.title) request.body.title = options.title;
    if (options.password) request.body.password = options.password;
    if (options.excerpt) request.body.excerpt = options.excerpt;
    if (options.comment_status)
      request.body.comment_status = options.comment_status;
    if (options.ping_status) request.body.ping_status = options.ping_status;
    if (options.status) request.body.status = options.status;
    if (options.content) request.body.content = options.content;
    return request;
  }

  getPostsRequest(options: any) {
    var path = "/wp/v2/posts/";
    var params = ["status=publish,future,draft,pending,private"];
    if (options.query) {
      params.push("search=" + options.query);
    }
    if (options.page) {
      params.push("page=" + options.page);
    }
    if (options.per_page) {
      params.push("per_page=" + options.per_page);
    }
    if (options.order) {
      params.push("order=" + options.order);
    }
    if (options.orderby) {
      params.push("orderby=" + options.orderby);
    }
    if (options.searchIn) {
    }
    var qp = params.join("&");
    var request = this.newRequest(path + "?" + qp);
    return request;
  }

  removePostRequest(id: any) {
    var path = "/wp/v2/posts/" + id;
    var request = this.newRequest(path);
    request.options.method = "DELETE";
    return request;
  }
}

class MediumApi extends SiteApi {
  createPostRequest(post: Post, options: any = null) {
    return new Request("", {});
  }

  updatePostRequest(postid: String, options: any = null) {
    return new Request("", {});
  }

  getPostsRequest(options: any) {
    return new Request("", {});
  }

  removePostRequest(id: any) {
    return new Request("", {});
  }
}

class LinkedInApi extends SiteApi {
  createPostRequest(post: Post, options: any = null) {
    return new Request("", {});
  }

  updatePostRequest(postid: String, options: any = null) {
    return new Request("", {});
  }

  getPostsRequest(options: any) {
    return new Request("", {});
  }

  removePostRequest(id: any) {
    return new Request("", {});
  }
}

/**
We have  few models:

1. A Platform - who is hosting the blogs - you can hit their endpoints to CRUD on posts.
2. Authentication - One platform can have multiple authentications - JWT, OAUTH, Password etc.
3. SiteConfig - Contains the actual config for the site.
4. API Type - this can be json api, xml api, different endpoints etc

But really 1 and 3 are the "same". and 4 is really tied to 1 and 3.

eg:

Public WordPress - siteUrl + oauth2
Public WordPress - siteUrl + jwt (if installed)
Medium - username + integration tokens
LInkedIn - username + chrome plugin info
Private Wordpress - siteUrl + JWT credentials + rpc
Private Wordpress - siteUrl + OAUTH credentials + json api
Private Wordpress - siteUrl + OAUTH credentials + xml api
Private Wordpress - siteUrl + OAUTH credentials + xml api

- But  API can be differnt?  one could be a rest API - one could be a rpc api that needs to send tokens a different way?

What if auth and api are actually intertwined?

ie say the bearer token needs to be set as a header for some requests, but as a post body for others - and this is really site dependant.

then what is needed is a what to orchestrate between the apiClient and the authClient.

So best for apiClient to just create rquest objects and let 
*/

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
  title: string;
  siteType: SiteType;
  siteConfig: any;
  siteApi: SiteApi;
  authType: AuthType;
  authConfig: any;
  authClient: AuthClient;
  selectedPost: any = null;

  constructor(title: string, configs: any) {
    this.title = title;
    configs = configs || {};
    this.siteType = ensureParam(configs, "siteType");
    this.authType = ensureParam(configs, "authType");
    this.siteConfig = ensureParam(configs, "siteConfig");
    this.authConfig = ensureParam(configs, "authConfig");
    this.siteApi = createSiteApi(this.siteType, name, this.siteConfig);
    this.authClient = createAuthClient(this.authType, name, this.authConfig);
  }

  static defaultSite(): Site {
    return new Site("My Amazing Site", {
      siteType: SiteType.WORDPRESS,
      siteConfig: WPRestApi.defaultConfig(),
      authType: AuthType.JWT,
      authConfig: JWTAuthClient.defaultConfig(),
    });
  }

  equals(another: Site): boolean {
    return (
      this.title == another.title &&
      this.siteType == another.siteType &&
      this.authType == another.authType &&
      this.authConfig == another.authConfig &&
      this.siteConfig == another.siteConfig
    );
  }

  get config(): any {
    return {
      title: this.title,
      config: {
        siteType: this.siteType,
        authType: this.authType,
        siteConfig: this.siteConfig,
        authConfig: this.authConfig,
      },
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

  async saveAll() {
    var configs = this.sites.map((site: Site) => {
      return site.config;
    });
    return this.store.set("sites", configs);
  }

  async loadAll() {
    var sites = (await this.store.get("sites")) || [];
    this.sites = sites.map(function (data: any, _index: Int) {
      return new Site(data.title, data.config);
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
