import { Request, URLBuilder } from "./net";
import { ensureParam } from "./utils";
import { Post } from "./models";
import { SiteType } from "./enums";
import { loadDefaults } from "./defaults";

const Defaults = loadDefaults();

export abstract class SiteApi {
  config: any;
  constructor(config: any) {
    this.config = config || {};
  }

  abstract createPostRequest(post: Post, options: any): Request;
  abstract updatePostRequest(postid: String, options: any): Request;
  abstract getPostsRequest(options: any): Request;
  abstract removePostRequest(id: any): Request;
}

export function createSiteApi(siteType: SiteType, configs: any): SiteApi {
  if (siteType == SiteType.WORDPRESS) {
    return new WPRestApi(configs);
  } else if (siteType == SiteType.MEDIUM) {
    return new MediumApi(configs);
  } else if (siteType == SiteType.LINKEDIN) {
    return new LinkedInApi(configs);
  } else {
    throw new Error("SiteType not supported yet");
  }
}

export class WPRestApi extends SiteApi {
  apiUrl: string;
  constructor(config: any) {
    super(config);
    this.apiUrl = ensureParam(config, "apiUrl");
  }

  static defaultConfig() {
    return {
      apiUrl: Defaults.WPRestApi.ApiUrl,
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
