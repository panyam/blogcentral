import { Nullable } from "./types";
import { Request } from "./net";
import { ensureParam } from "./utils";
import { App } from "./app";
import { AuthType, AuthClient } from "./interfaces";

export function createAuthClient(authType: AuthType, app: App, configs: any) {
  if (authType == AuthType.TOKEN) {
    return new TokenAuthClient(app, configs);
  } else if (authType == AuthType.JWT) {
    return new JWTAuthClient(app, configs);
  } else if (authType == AuthType.OAUTH2) {
    return new OAuthClient(app, configs);
  } else {
    throw new Error("AuthType not supported yet");
  }
}

export class OAuthClient implements AuthClient {
  app: App;
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
  requestTokenUrl: string;
  authorizeUrl: string;
  authenticateUrl: string;

  constructor(app: App, config: any) {
    this.app = app;
    this.clientId = ensureParam(config, "clientId");
    this.clientSecret = ensureParam(config, "clientSecret");
    this.requestTokenUrl = ensureParam(config, "requestTokenUrl");
    this.redirectUrl = ensureParam(config, "redirectUrl");
    this.authorizeUrl = ensureParam(config, "authorizeUrl");
    this.authenticateUrl = ensureParam(config, "authenticateUrl");
  }

  decorateRequest(request: Request): Request {
    return request;
  }
}

export class TokenAuthClient implements AuthClient {
  app: App;
  token: Nullable<string> = null;
  expiresAt: number = 0;
  constructor(app: App, config: any) {
    this.app = app;
    this.token = config.token || null;
    this.expiresAt = config.expiresAt || Date.now();
  }

  decorateRequest(request: Request): Request {
    if (this.token) {
      request.headers["Authorization"] = "Bearer " + this.token;
    }
    return request;
  }
}

export class JWTAuthClient extends TokenAuthClient {
  tokenUrl: string;
  validateUrl: string;

  constructor(app: App, config: any) {
    super(app, config);
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
    var response = await this.app.httpClient.send(request);
    return response.data.token;
  }

  async validateToken() {
    var request = new Request(this.validateUrl, {
      method: "post",
      contentType: "application/json",
    });
    request = this.decorateRequest(request);
    return await this.app.httpClient.send(request);
  }
}
