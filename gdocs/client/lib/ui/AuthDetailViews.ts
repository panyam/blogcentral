import { ActivityIndicator } from "./ActivityIndicator";
import { View } from "./Views";
import { valOrDefault } from "../utils";

declare var BCDefaults: any;

export class AuthDetailView extends View<any> {
  activityIndicator: ActivityIndicator;
  allFields: JQuery<any>;

  constructor(elem_or_id: any, authConfig: any = null) {
    super(elem_or_id, "authConfig", authConfig || {});
  }
}

export class TokenAuthDetailView extends AuthDetailView {
  authBaseUrlLabel: JQuery<HTMLElement>;
  authBaseUrlElem: JQuery<HTMLElement>;
  tokenLabel: JQuery<HTMLElement>;
  tokenElem: JQuery<HTMLElement>;
  expiresAtLabel: JQuery<HTMLElement>;
  expiresAtElem: JQuery<HTMLElement>;

  setupViews() {
    super.setupViews();
    this.tokenElem = this.rootElement.find("#token");
    this.tokenLabel = this.rootElement.find("label[for='token']");
    this.expiresAtElem = this.rootElement.find("#expiresAt");
    this.expiresAtLabel = this.rootElement.find("label[for='expiresAt']");
    this.authBaseUrlElem = this.rootElement.find("#authBaseUrl");
    this.authBaseUrlLabel = this.rootElement.find("label[for='authBaseUrl']");
  }

  extractEntity() {
    var out = { token: this.tokenElem.val() || "" } as any;
    out["authBaseUrl"] = this.authBaseUrlElem.val();
    // this._entity["expiresAt"] = this.expiresAtElem.val();
    return out;
  }

  template(): string {
    return `
        <label for="authBaseUrl">Auth Base Url</label>
        <input type="text" name="authBaseUrl" id="authBaseUrl" 
               class="text ui-widget-content ui-corner-all" 
               value = "{{eitherVal authConfig.authBaseUrl Defaults.TokenAuthClient.AuthBaseUrl }}"/>

        <label for="token">Token</label>
        <input type="text" name="token" id="token" class="text ui-widget-content ui-corner-all" 
               value = "{{eitherVal authConfig.token Defaults.TokenAuthClient.Token }}"/>
    <!--
        <label for="expiresAt">Expires At</label>
        <input type="date" name="expiresAt" id="expiresAt" value="" class="text ui-widget-content ui-corner-all" />
        -->
      `;
  }
}

/**
 * A view to capture details about logging into publicly hosted wordpress site.
 */
export class JWTAuthDetailView extends TokenAuthDetailView {
  tokenUrlLabel: JQuery<HTMLElement>;
  tokenUrlElem: JQuery<HTMLElement>;
  validateUrlLabel: JQuery<HTMLElement>;
  validateUrlElem: JQuery<HTMLElement>;

  setupViews() {
    super.setupViews();
    this.tokenUrlElem = this.rootElement.find("#tokenUrl");
    this.tokenUrlLabel = this.rootElement.find("label[for='tokenUrl']");
    this.validateUrlElem = this.rootElement.find("#validateUrl");
    this.validateUrlLabel = this.rootElement.find("label[for='validateUrl']");
    this.tokenLabel.html("Current Token (optional)");
  }

  extractEntity() {
    var entity: any = super.extractEntity();
    entity["tokenUrl"] = this.tokenUrlElem.val();
    entity["validateUrl"] = this.validateUrlElem.val();
    return entity;
  }

  template(): string {
    return `
        <label for="authBaseUrl">Auth Base Url</label>
        <input type="text" name="authBaseUrl" id="authBaseUrl" 
               class="text ui-widget-content ui-corner-all" 
               value = "{{eitherVal authConfig.authBaseUrl Defaults.TokenAuthClient.AuthBaseUrl }}"/>

        <label for="tokenUrl">Token URL</label>
        <input type="text" name="tokenUrl" id="tokenUrl" class="text ui-widget-content ui-corner-all" 
               value = "{{ eitherVal authConfig.tokenUrl Defaults.JWTAuthClient.TokenUrl }}"/>

        <label for="validateUrl">Validate URL</label>
        <input type="text" name="validateUrl" id="validateUrl" class="text ui-widget-content ui-corner-all" 
               value = "{{ eitherVal authConfig.validateUrl Defaults.JWTAuthClient.ValidateUrl }}"/>

        <label for="token">Token</label>
        <input type="text" name="token" id="token" 
               class="text ui-widget-content ui-corner-all" 
               value = "{{authConfig.token}}"/>
    `;
  }
}

export class OAuth2AuthDetailView extends AuthDetailView {
  template(): string {
    return `
    I Got nothing yet!!!
      `;
  }
}
