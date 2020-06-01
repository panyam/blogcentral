import { AuthConfig, AuthResult, AuthClient } from "../authclients";
import { URLBuilder } from "../net";
import { ensureCreated } from "../ui/utils";
import { Request } from "../net";
import { FormDialog } from "../ui/Views";

export interface OAuth2AuthConfig extends AuthConfig {
  clientId: string;
  tokenUrl: string;
  responseType: string;
  state: string;
  scope: string;
  redirectUri: string;
  authorizeUrl: string;
  authenticateUrl: string;
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
    return request;
  }

  /**
   * Checks if auth credentials are valid asynchronously.
   * Returns true if auth credentials are valid and requests can
   * be signed with respective credentials going forward.
   */
  async validateAuth() {
    // throw new Error("Not Implemented");
    return false;
  }

  get fullAuthorizeUrl() {
    var ac = this.authConfig;
    // this should really be based on where we are running as and is specific to where application is deployed
    var authUrl = new URLBuilder(ac.authorizeUrl)
      .addParam("client_id", ac.clientId)
      .addParam("redirect_uri", ac.redirectUri)
      .addParam("response_type", ac.responseType)
      .addParam("scope", ac.scope)
      .addParam("state", ac.state)
      .build();
    return authUrl;
  }

  /**
   * Begin's the auth flow
   * Returns true if auth resulted in valid credentials false otherwise.
   */
  async startAuthFlow() {
    // throw new Error("Not Implemented");
    var elem = ensureCreated("start_oauth_auth_dialog");
    elem.addClass("form_dialog");
    var tokenDialog = new FormDialog<any>(elem, null, this)
      .addButton("Cancel")
      .setTemplate(
        `<button class="blue">
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
}
