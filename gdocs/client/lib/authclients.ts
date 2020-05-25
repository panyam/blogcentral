import { Nullable } from "./types";
import { Request } from "./net";
import { ensureParam } from "./utils";
import { App } from "./app";
import { Site } from "./models";
import { AuthType } from "./enums";
import { ensureCreated } from "./ui/utils";
import { FormDialog } from "./ui/Views";

export enum AuthResult {
  SUCCESS,
  FAILURE,
  CANCELLED,
}

export interface AuthClient {
  /**
   * Creates a request decorated with all auth details.
   */
  decorateRequest(request: Request): Request;

  /**
   * Checks if a site's auth credentials are valid asynchronously.
   * Returns true if site's auth credentials are valid and requests can
   * be signed with respective credentials going forward.
   */
  validateAuth(site: Site): Promise<boolean>;

  /**
   * Begin's the auth flow for a particular site.
   * Returns true if auth resulted in valid credentials false otherwise.
   */
  startAuthFlow(site: Site): Promise<AuthResult>;
}

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

  /**
   * Checks if a site's auth credentials are valid asynchronously.
   * Returns true if site's auth credentials are valid and requests can
   * be signed with respective credentials going forward.
   */
  async validateAuth(_site: Site) {
    throw new Error("Not Implemented");
    return false;
  }

  /**
   * Begin's the auth flow for a particular site.
   * Returns true if auth resulted in valid credentials false otherwise.
   */
  async startAuthFlow(_site: Site) {
    throw new Error("Not Implemented");
    return AuthResult.CANCELLED;
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

  a() {
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
  }

  /**
   * Checks if a site's auth credentials are valid asynchronously.
   * Returns true if site's auth credentials are valid and requests can
   * be signed with respective credentials going forward.
   */
  async validateAuth(site: Site) {
    var token = ((site.authConfig.token as string) || "").trim();
    if (token.length == 0) {
      return false;
    }
    var expiresAt = site.authConfig.expiresAt || 0;
    if (expiresAt >= 0 && expiresAt <= Date.now()) {
      return false;
    }
    return true;
  }

  /**
   * Begin's the auth flow for a particular site.
   * Returns true if auth resulted in valid credentials false otherwise.
   */
  async startAuthFlow(_site: Site) {
    // Show a dialog asking for token
    var elem = ensureCreated("start_token_auth_dialog");
    var tokenDialog = new FormDialog<any>(elem, null, null);
    tokenDialog.setTemplate(``);
    tokenDialog.addButton("Login").addButton("Cancel");
    var result = (await tokenDialog.open()) as any;
    if (result.title == "Cancel") {
      return AuthResult.CANCELLED;
    }
    return AuthResult.SUCCESS;
  }

  static defaultConfig(): any {
    return {
      token: "",
      expiresAt: 0,
    };
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

  static defaultConfig(): any {
    var out = super.defaultConfig();
    out["tokenUrl"] = "/wp-json/jwt-auth/v1/token";
    out["validateUrl"] = "/wp-json/jwt-auth/v1/token/validate";
    return out;
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
