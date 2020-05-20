
import { Nullable } from "./types";
import { Site, Post } from "./models";
import { Response } from "./net";
import { Authenticator } from "./auth";
import { ServiceCatalog } from "./catalog";

export interface PlatformClient {
  createPost(site: Site, post: Post, options: any) : Promise<Response>
  updatePost(site: Site, postid: String, options: any) : Promise<Response>
  getPosts(site: Site, options: any) : Promise<Response>
  removePost(site: Site, id: any) : Promise<Response>
}

export class MediumClient implements PlatformClient {
  services: ServiceCatalog;
  authenticator : Authenticator
  constructor(services: ServiceCatalog, authenticator : Authenticator) {
      this.authenticator = authenticator
    this.services = services;
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

export class WPClient implements PlatformClient {
  services: ServiceCatalog;
  authenticator : Authenticator
  constructor(services: ServiceCatalog, authenticator : Authenticator) {
      this.authenticator = authenticator
    this.services = services;
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
