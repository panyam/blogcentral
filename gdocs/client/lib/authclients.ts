import { Nullable } from "./types";
import { Request, URLBuilder } from "./net";
import { dateDelta, ensureParam } from "./utils";
import { App } from "./app";
import { Site } from "./models";
import { AuthType } from "./enums";
import { ensureCreated } from "./ui/utils";
import { FormDialog } from "./ui/Views";

declare var BCDefaults: any;

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
  authBaseUrl: string;
  token: Nullable<string> = null;
  tokenCreatedAt: number = 0;
  tokenExpiresAt: number = 0;
  constructor(app: App, config: any) {
    this.app = app;
    this.authBaseUrl = ensureParam(config, "authBaseUrl");
    this.token = config.token || null;
    this.tokenExpiresAt = config.tokenExpiresAt || Date.now();
    this.tokenCreatedAt = config.tokenCreatedAt || 0;
  }

  decorateRequest(request: Request): Request {
    if (this.token) {
      request.headers["Authorization"] = "Bearer " + this.token;
    }
    return request;
  }

  async isTokenValid(site: Site) {
    var token = ((site.authConfig.token as string) || "").trim();
    return token.length != 0;
  }

  async hasTokenExpired(site: Site) {
    var tokenExpiresAt = site.authConfig.tokenExpiresAt || 0;
    return tokenExpiresAt >= 0 && tokenExpiresAt <= Date.now();
  }

  /**
   * Checks if a site's auth credentials are valid asynchronously.
   * Returns true if site's auth credentials are valid and requests can
   * be signed with respective credentials going forward.
   */
  async validateAuth(site: Site) {
    if (!(await this.isTokenValid(site))) return false;
    if (await this.hasTokenExpired(site)) return false;
    return true;
  }

  /**
   * Begin's the auth flow for a particular site.
   * Returns true if auth resulted in valid credentials false otherwise.
   */
  async startAuthFlow(site: Site) {
    // Show a dialog asking for token
    var elem = ensureCreated("start_token_auth_dialog");
    elem.addClass("form_dialog");
    var tokenDialog = new FormDialog<any>(elem, null, null)
      .addButton("Login")
      .addButton("Cancel")
      .setTemplate(
        `
        <label for="token">Token</label>
        <input type="text" name="token" id="token" 
               class="text ui-widget-content ui-corner-all" 
               value = ""/>
        `
      )
      .setup();
    tokenDialog.title = "Enter Token";
    var tokenElem = elem.find("#token");
    tokenDialog.shouldClose = (button: any) => {
      if (button.title == "Cancel") return true;
      var token = tokenElem.val().trim();
      return token.length > 0;
    };
    var result = (await tokenDialog.open()) as any;
    if (result.title == "Cancel") {
      tokenDialog.destroy();
      return AuthResult.CANCELLED;
    }
    site.authConfig.token = tokenElem.val().trim();
    tokenDialog.destroy();
    return AuthResult.SUCCESS;
  }

  static defaultConfig(): any {
    var out = {} as any;
    out["authBaseUrl"] = BCDefaults.TokenAuthClient.AuthBaseUrl;
    out["tokenUrl"] = BCDefaults.TokenAuthClient.TokenUrl;
    out["validateUrl"] = BCDefaults.TokenAuthClient.ValidateUrl;
    out["token"] = "";
    out["tokenExpiresAt"] = 0;
    return out;
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
    out["tokenUrl"] = BCDefaults.JWTAuthClient.TokenUrl;
    out["validateUrl"] = BCDefaults.JWTAuthClient.ValidateUrl;
    return out;
  }

  async login(username: string, password: string) {
    var payload = {
      username: username,
      password: password,
    };
    var url = new URLBuilder(this.authBaseUrl)
      .appendPath(this.tokenUrl)
      .build();
    var request = new Request(url, {
      method: "post",
      contentType: "application/json",
      body: payload,
    });
    var response = await this.app.httpClient.send(request);
    return response.data.token;
  }

  async validateToken() {
    var url = new URLBuilder(this.authBaseUrl)
      .appendPath(this.validateUrl)
      .build();
    var request = new Request(url, {
      method: "post",
      contentType: "application/json",
    });
    request = this.decorateRequest(request);
    return this.app.httpClient.send(request);
  }

  async hasTokenExpired(site: Site) {
    if (!(await super.hasTokenExpired(site))) return false;
    var response = await this.validateToken();
    return false;
  }

  /**
   * Begin's the auth flow for a particular site.
   * Returns true if auth resulted in valid credentials false otherwise.
   */
  async startAuthFlow(site: Site) {
    // Show a dialog asking for token
    var elem = ensureCreated("start_jwt_auth_dialog");
    elem.addClass("form_dialog");
    var tokenDialog = new FormDialog<any>(elem, null, site.authConfig)
      .addButton("Login")
      .addButton("Cancel")
      .setTemplate(
        `
        <label for="username">Username</label>
        <input type="text" name="username" id="username" 
               class="text ui-widget-content ui-corner-all" 
               value = "{{ eitherVal entity.username Defaults.JWTAuthClient.Username }}"/>
        <label for="password">Password</label>
        <input type="password" name="password" id="password" 
               class="text ui-widget-content ui-corner-all" 
               value = "{{Defaults.JWTAuthClient.Password}}"/>
        `
      )
      .setup();
    tokenDialog.title = "Enter Username/Password";
    var usernameElem = elem.find("#username");
    var passwordElem = elem.find("#password");
    tokenDialog.shouldClose = (button: any) => {
      if (button == null || button.text == "Cancel") return true;
      var username = usernameElem.val().trim();
      var password = passwordElem.val().trim();
      return username.length > 0 && password.length > 0;
    };
    var result = (await tokenDialog.open()) as any;
    if (result.text == "Cancel") {
      return AuthResult.CANCELLED;
    }
    var username = usernameElem.val().trim();
    var password = passwordElem.val().trim();

    // use this to get token
    site.authConfig.username = username;
    site.authConfig.token = await this.login(username, password);
    site.authConfig.tokenCreatedAt = Date.now();
    site.authConfig.tokenExpiresAt = dateDelta(Date.now(), 3600);
    return AuthResult.SUCCESS;
  }
}
