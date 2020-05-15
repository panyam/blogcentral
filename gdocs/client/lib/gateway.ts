import { Site, Post } from "./models";
import { Request } from "./net";
import { ServiceCatalog } from "./catalog";

export class SiteGateway {
  services: ServiceCatalog;

  constructor(services: ServiceCatalog) {
    this.services = services;
  }

  siteEndPoint(site: Site, path: string) {
    var apiHost = site.site_host;
    if (!apiHost.endsWith("/")) {
      apiHost += "/";
    }
    apiHost += "wp-json";
    var url = apiHost;
    if (!path.startsWith("/")) {
      url += "/";
    }
    url += path;
    return url;
  }

  siteRequest(site: Site, path: string): Request {
    var url = this.siteEndPoint(site, path);
    // see if we have a valid token
    var headers = {
      Authorization: "Bearer " + site.config.token,
    };
    var request = new Request(url, {
      contentType: "application/json",
      headers: headers,
    });
    return request;
  }

  async loginToWordpress(site: Site, credentials: any) {
    var httpClient = this.services.httpClient;
    var payload = {
      username: site.username,
      password: credentials.password,
    };
    var apiHost = site.site_host + "/wp-json";
    var url = apiHost + "/jwt-auth/v1/token";
    var request = new Request(url, {
      method: "post",
      contentType: "application/json",
      body: payload,
    });
    var response = await httpClient.send(request);
    return response.data.token;
  }

  async validateToken(site: Site) {
    var request = this.siteRequest(site, "/jwt-auth/v1/token/validate");
    request.options.method = "post";
    try {
      var httpClient = this.services.httpClient;
      var _response = await httpClient.send(request);
      site.config.tokenValidatedAt = Date.now();
      return true;
    } catch (e) {
      site.config.tokenValidatedAt = 0;
      console.log("Validation Exception: ", e);
      return false;
    }
  }

  async createPost(site: Site, post: Post, options: any = null) {
    var httpClient = this.services.httpClient;
    var path = "/wp/v2/posts/";
    options = options || {};
    var request = this.siteRequest(site, path);
    request.options.method = "post";
    request.body = {};
    request.body.title = options.title || post.options.title;
    request.body.password = options.password || post.options.password;
    request.body.excerpt = options.excerpt || post.options.excerpt;
    request.body.comment_status = options.comment_status || "closed";
    request.body.ping_status = options.ping_status || "closed";
    request.body.status = options.status || "draft";
    request.body.content = options.content || "<h1>Hello World</h1>";
    return httpClient.send(request);
  }

  async updatePost(site: Site, postid: String, options: any = null) {
    var httpClient = this.services.httpClient;
    var path = "/wp/v2/posts/" + postid;
    options = options || {};
    var request = this.siteRequest(site, path);
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
    return httpClient.send(request);
  }

  async getPosts(site: Site, options: any) {
    var httpClient = this.services.httpClient;
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
    var request = this.siteRequest(site, path + "?" + qp);
    try {
      var response = await httpClient.send(request);
      return response.data.map((p: any) => {
        return new Post(p.id, p);
      });
    } catch (e) {
      console.log("Get Posts Exception: ", e);
      throw e;
    }
  }

  async removePost(site: Site, id: any) {
    var httpClient = this.services.httpClient;
    var path = "/wp/v2/posts/" + id;
    var request = this.siteRequest(site, path);
    request.options.method = "DELETE";
    return httpClient.send(request);
  }
}