import { AuthResult, AuthConfig, AuthClient } from "../authclients";
import { Nullable } from "../types";
import { Request } from "../net";
import { ensureCreated } from "../ui/utils";
import { FormDialog } from "../ui/Views";
import { AUTH_TYPE_TOKEN } from "./core";

declare var BCDefaults: any;

export interface TokenAuthConfig extends AuthConfig {
  authBaseUrl: string;
  token?: Nullable<string>;
  tokenCreatedAt?: number;
  tokenExpiresAt?: number;
}

export class TokenAuthClient implements AuthClient {
  _authConfig: TokenAuthConfig;
  constructor(config: TokenAuthConfig) {
    this._authConfig = config;
  }

  get authConfig() {
    return this._authConfig;
  }

  decorateRequest(request: Request): Request {
    if (this.authConfig.token) {
      request.headers["Authorization"] = "Bearer " + this.authConfig.token;
    }
    return request;
  }

  async isTokenValid() {
    var token = ((this.authConfig.token as string) || "").trim();
    return token.length != 0;
  }

  async hasTokenExpired() {
    var tokenExpiresAt = this.authConfig.tokenExpiresAt || 0;
    return tokenExpiresAt >= 0 && tokenExpiresAt <= Date.now();
  }

  /**
   * Checks if a site's auth credentials are valid asynchronously.
   * Returns true if site's auth credentials are valid and requests can
   * be signed with respective credentials going forward.
   */
  async validateAuth() {
    if (!(await this.isTokenValid())) return false;
    if (await this.hasTokenExpired()) return false;
    return true;
  }

  /**
   * Begin's the auth flow for a particular site.
   * Returns true if auth resulted in valid credentials false otherwise.
   */
  async startAuthFlow() {
    // Show a dialog asking for token
    var elem = ensureCreated("start_token_auth_dialog");
    elem.addClass("form_dialog");
    var tokenDialog = new FormDialog<any>(elem, null, this.authConfig)
      .addButton("Login")
      .addButton("Cancel")
      .setTemplate(
        `
        <label for="token">Token</label>
        <input type="text" name="token" id="token" 
               class="text ui-widget-content ui-corner-all" 
               value = "{{eitherVal entity.token Defaults.TokenAuthClient.Token }}"/>
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
    this.authConfig.token = tokenElem.val().trim();
    tokenDialog.destroy();
    return AuthResult.SUCCESS;
  }

  completeAuthFlow(_authResult : any) : boolean {
      return false;
  }

  static defaultConfig(): TokenAuthConfig {
    var out = {} as any;
    out["authType"] = AUTH_TYPE_TOKEN;
    out["authBaseUrl"] = BCDefaults.TokenAuthClient.AuthBaseUrl;
    out["tokenUrl"] = BCDefaults.TokenAuthClient.TokenUrl;
    out["validateUrl"] = BCDefaults.TokenAuthClient.ValidateUrl;
    out["token"] = "";
    out["tokenExpiresAt"] = 0;
    return out;
  }
}
