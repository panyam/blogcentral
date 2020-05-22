import { Nullable } from "./types";
import { Request, HttpClient } from "./net";
import { ensureParam } from "./utils";
import { ServiceCatalog } from "./catalog";

export enum AuthType {
  TOKEN,
  JWT,
  OAUTH2,
}

export function createAuthClient(
  authType: AuthType,
  services: ServiceCatalog,
  configs: any
) {
  if (authType == AuthType.TOKEN) {
    return new TokenAuthClient(services, configs);
  } else if (authType == AuthType.JWT) {
    return new JWTAuthClient(services, configs);
  } else if (authType == AuthType.OAUTH2) {
    return new OAuthClient(services, configs);
  } else {
    throw new Error("AuthType not supported yet");
  }
}

export interface AuthClient {
  /**
   * Creates a request decorated with all auth details.
   */
  decorateRequest(request: Request): Request;
}

export class OAuthClient implements AuthClient {
  services: ServiceCatalog;
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
  requestTokenUrl: string;
  authorizeUrl: string;
  authenticateUrl: string;

  constructor(services: ServiceCatalog, config: any) {
    this.services = services;
    this.clientId = ensureParam(config, "clientId");
    this.clientSecret = ensureParam(config, "clientSecret");
    this.requestTokenUrl = ensureParam(config, "requestTokenUrl");
    this.redirectUrl = ensureParam(config, "redirectUrl");
    this.authorizeUrl = ensureParam(config, "authorizeUrl");
    this.authenticateUrl = ensureParam(config, "authenticateUrl");
  }

  async ensureLoggedIn() {
    return false;
  }

  decorateRequest(request: Request): Request {
    return request;
  }
}

export class TokenAuthClient implements AuthClient {
  services: ServiceCatalog;
  token: Nullable<string> = null;
  tokenExpiresAt: Nullable<number> = null;
  constructor(services: ServiceCatalog, config: any) {
    this.services = services;
    this.token = config.token || null;
  }

  decorateRequest(request: Request): Request {
    if (this.token) {
      request.headers["Authorization"] = "Bearer " + this.token;
    }
    return request;
  }

  /**
   * Token already provided and do not expire so no login required.
   */
  async ensureLoggedIn() {
    return true;
  }
}

export class JWTAuthClient extends TokenAuthClient {
  tokenUrl: string;
  validateUrl: string;

  constructor(services: ServiceCatalog, config: any) {
    super(services, config);
    this.tokenUrl = ensureParam(config, "tokenUrl");
    this.validateUrl = ensureParam(config, "validateUrl");
  }

  async login(username: string, password: string) {
    var payload = {
      username: username,
      password: password,
    };
    var request = new Request(this.tokenUrl, {
      method: "post",
      contentType: "application/json",
      body: payload,
    });
    var response = await this.services.httpClient.send(request);
    return response.data.token;
  }

  async validateToken() {
    var request = new Request(this.validateUrl, {
      method: "post",
      contentType: "application/json",
    });
    request = this.decorateRequest(request);
    return await this.services.httpClient.send(request);
  }

}
