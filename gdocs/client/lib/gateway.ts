import { Nullable } from "./types";
import { Site, Post } from "./models";
import { Request, URLBuilder, HttpClient } from "./net";
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
    var client = new JWTAuthenticator(this.services.httpClient, site.site_host);
    var token = client.login(site.username, credentials.password);
    return token;
  }

  async validateToken(site: Site) {
    var client = new JWTAuthenticator(this.services.httpClient, site.site_host);
    try {
      client.token = site.config.token;
      client.validateToken();
      site.config.tokenValidatedAt = Date.now();
      return true;
    } catch (e) {
      site.config.tokenValidatedAt = 0;
      console.log("Validation Exception: ", e);
      return false;
    }
  }
}
