import { AuthConfig, AuthResult, AuthClient } from "../authclients";
import { Nullable } from "../types";
import { URLBuilder } from "../net";
import { ensureCreated } from "../ui/utils";
import { Request } from "../net";
import { FormDialog } from "../ui/Views";

export interface OAuth2AuthConfig extends AuthConfig {
  clientId: string;
  tokenUrl: string;
  scope: string;
  redirectUri: string;
  authorizeUrl: string;
  authenticateUrl: string;

  grantType?: Nullable<string>;
  responseType?: Nullable<string>;
  state?: Nullable<string>;

  token?: Nullable<string>;
  tokenExpiresAt?: number;
}

export class OAuth2AuthClient implements AuthClient {
  _authConfig: OAuth2AuthConfig;

  constructor(config: OAuth2AuthConfig) {
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
    return tokenExpiresAt > 0 && tokenExpiresAt <= Date.now();
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

  get fullAuthorizeUrl() {
    var ac = this.authConfig;
    // this should really be based on where we are running as and is specific to where application is deployed
    var state = {
      authType: ac.authType,
      clientId: ac.clientId,
      redirectUri: ac.redirectUri,
      forward_host: window.location.host,
    };
    var builder = new URLBuilder(ac.authorizeUrl)
      .addParam("client_id", ac.clientId)
      .addParam("redirect_uri", ac.redirectUri)
      .addParam("response_type", ac.responseType || "code")
      .addParam("state", JSON.stringify(state))
      .addParam("scope", ac.scope || "");
    return builder.build();
  }

  /**
   * Begin's the auth flow
   * Returns true if auth resulted in valid credentials false otherwise.
   */
  async startAuthFlow() {
    // throw new Error("Not Implemented");
    var elem = ensureCreated("start_oauth_auth_dialog");
    elem.addClass("form_dialog");
    var tokenDialog = new FormDialog<any>(elem, null, {
      fullAuthorizeUrl: this.fullAuthorizeUrl,
    })
      .addButton("Cancel")
      .setTemplate(
        `<button style="width: 100%" class="blue">
            <a href="{{entity.fullAuthorizeUrl}}">Start OAuth2 Login</a>
         </button>`
      )
      .setup();
    tokenDialog.title = "Start OAuth2 Login";
    var result = (await tokenDialog.open()) as any;
    if (result.text == "Cancel") {
      return AuthResult.CANCELLED;
    }

    // Can never get here
    return AuthResult.SUCCESS;
  }

  /**
   * Completes the auth flow with finalized auth results.
   */
  completeAuthFlow(authResult: any): boolean {
    if (
      this.authConfig.authType == authResult.state.authType &&
      this.authConfig.clientId == authResult.state.clientId &&
      this.authConfig.redirectUri == authResult.state.redirectUri
    ) {
      this.authConfig.token = authResult.response.access_token || null;
      this.authConfig.tokenExpiresAt = authResult.response.expires_in || null;
      return true;
    }
    return false;
  }
}
