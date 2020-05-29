import { AuthResult } from "../authclients";
import { TokenAuthConfig, TokenAuthClient } from "../tokenauth/client";
import { Request, URLBuilder, HttpClient } from "../net";
import { dateDelta } from "../utils";
import { ensureCreated } from "../ui/utils";
import { FormDialog } from "../ui/Views";
import { AUTH_TYPE_LOGIN } from "./core";

declare var BCDefaults: any;

export interface LoginAuthConfig extends TokenAuthConfig {
  username?: string;
  tokenUrl: string;
  validateUrl: string;
}

export class LoginAuthClient extends TokenAuthClient {
  httpClient: HttpClient;

  constructor(httpClient: HttpClient, config: LoginAuthConfig) {
    super(config);
    this.httpClient = httpClient;
  }

  get authConfig() {
    return this._authConfig as LoginAuthConfig;
  }

  static defaultConfig(): LoginAuthConfig {
    var out = {} as any;
    out["authType"] = AUTH_TYPE_LOGIN;
    out["authBaseUrl"] = BCDefaults.LoginAuthClient.AuthBaseUrl;
    out["token"] = "";
    out["tokenExpiresAt"] = 0;
    out["tokenUrl"] = BCDefaults.LoginAuthClient.TokenUrl;
    out["validateUrl"] = BCDefaults.LoginAuthClient.ValidateUrl;
    return out;
  }

  async login(username: string, password: string) {
    var payload = {
      username: username,
      password: password,
    };
    var url = new URLBuilder(this.authConfig.authBaseUrl)
      .appendPath(this.authConfig.tokenUrl)
      .build();
    var request = new Request(url, {
      method: "post",
      contentType: "application/json",
      body: payload,
    });
    var response = await this.httpClient.send(request);
    return response.data.token;
  }

  async validateToken() {
    var url = new URLBuilder(this.authConfig.authBaseUrl)
      .appendPath(this.authConfig.validateUrl)
      .build();
    var request = new Request(url, {
      method: "post",
      contentType: "application/json",
    });
    request = this.decorateRequest(request);
    return this.httpClient.send(request);
  }

  async hasTokenExpired() {
    var expired = await super.hasTokenExpired();
    if (!expired) return false;
    var response = await this.validateToken();
    return false;
  }

  /**
   * Begin's the auth flow for a particular site.
   * Returns true if auth resulted in valid credentials false otherwise.
   */
  async startAuthFlow() {
    // Show a dialog asking for token
    var elem = ensureCreated("start_jwt_auth_dialog");
    elem.addClass("form_dialog");
    var tokenDialog = new FormDialog<any>(elem, null, this.authConfig)
      .addButton("Login")
      .addButton("Cancel")
      .setTemplate(
        `
        <label for="username">Username</label>
        <input type="text" name="username" id="username" 
               class="text ui-widget-content ui-corner-all" 
               value = "{{ eitherVal entity.username Defaults.LoginAuthClient.Username }}"/>
        <label for="password">Password</label>
        <input type="password" name="password" id="password" 
               class="text ui-widget-content ui-corner-all" 
               value = "{{Defaults.LoginAuthClient.Password}}"/>
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
    this.authConfig.username = username;
    this.authConfig.token = await this.login(username, password);
    this.authConfig.tokenCreatedAt = Date.now();
    this.authConfig.tokenExpiresAt = dateDelta(Date.now(), 3600);
    return AuthResult.SUCCESS;
  }
}
