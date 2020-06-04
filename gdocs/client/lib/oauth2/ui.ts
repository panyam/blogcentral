import { AuthDetailView } from "../ui/AuthDetailViews";
import { AUTH_TYPE_OAUTH2 } from "./core";
import { IOAuth2AuthDetailView } from "./interfaces";

export class OAuth2AuthDetailView extends AuthDetailView
  implements IOAuth2AuthDetailView {
  authBaseUrlLabel: any;
  authBaseUrlElem: any;
  clientIdLabel: any;
  clientIdElem: any;
  tokenUrlLabel: any;
  tokenUrlElem: any;
  redirectUriLabel: any;
  redirectUriElem: any;
  authorizeUrlLabel: any;
  authorizeUrlElem: any;
  authenticateUrlLabel: any;
  authenticateUrlElem: any;

  setupViews() {
    super.setupViews();
    this.authBaseUrlElem = this.findElement("#authBaseUrl");
    this.authBaseUrlLabel = this.findElement("label[for='authBaseUrl']");
    this.clientIdElem = this.findElement("#clientId");
    this.clientIdLabel = this.findElement("label[for='clientId']");
    this.tokenUrlElem = this.findElement("#tokenUrl");
    this.tokenUrlLabel = this.findElement("label[for='tokenUrl']");
    this.redirectUriElem = this.findElement("#redirectUri");
    this.redirectUriLabel = this.findElement("label[for='redirectUri']");
    this.authorizeUrlElem = this.findElement("#authorizeUrl");
    this.authorizeUrlLabel = this.findElement("label[for='authorizeUrl']");
    this.authenticateUrlElem = this.findElement("#authenticateUrl");
    this.authenticateUrlLabel = this.findElement(
      "label[for='authenticateUrl']"
    );
  }

  get clientId() {
    return this.clientIdElem.val() as string;
  }
  set clientId(t: string) {
    this.clientIdElem.val(t);
  }
  get authBaseUrl() {
    return this.authBaseUrlElem.val() as string;
  }
  set authBaseUrl(t: string) {
    this.authBaseUrlElem.val(t);
  }
  get tokenUrl() {
    return this.tokenUrlElem.val() as string;
  }
  set tokenUrl(t: string) {
    this.tokenUrlElem.val(t);
  }
  get authorizeUrl() {
    return this.authorizeUrlElem.val() as string;
  }
  set authorizeUrl(t: string) {
    this.authorizeUrlElem.val(t);
  }
  get authenticateUrl() {
    return this.authenticateUrlElem.val() as string;
  }
  set authenticateUrl(t: string) {
    this.authenticateUrlElem.val(t);
  }
  get redirectUri() {
    return this.redirectUriElem.val() as string;
  }
  set redirectUri(t: string) {
    this.redirectUriElem.val(t);
  }

  elementsFor(fieldName: string): any[] {
    if (fieldName == "tokenUrl") {
      return [this.tokenUrlLabel, this.tokenUrlElem];
    } else if (fieldName == "redirectUri") {
      return [this.redirectUriLabel, this.redirectUriElem];
    } else if (fieldName == "authBaseUrl") {
      return [this.authBaseUrlLabel, this.authBaseUrlElem];
    } else if (fieldName == "authorizeUrl") {
      return [this.authorizeUrlLabel, this.authorizeUrlElem];
    } else if (fieldName == "authenticateUrl") {
      return [this.authenticateUrlLabel, this.authenticateUrlElem];
    } else if (fieldName == "clientId") {
      return [this.clientIdLabel, this.clientIdElem];
    }
    return super.elementsFor(fieldName);
  }

  extractEntity() {
    var out = { authType: AUTH_TYPE_OAUTH2 };
    return out;
  }

  template(): string {
    return `
        <label for="authBaseUrl">Auth Base Url</label>
        <input type="text" name="authBaseUrl" id="authBaseUrl" 
               class="text ui-widget-content ui-corner-all" 
               value = "{{eitherVal authConfig.authBaseUrl Defaults.PublicWPOAuth2Api.AuthBaseUrl }}"/>

        <label for="clientId">Client ID</label>
        <input type="text" name="clientId" id="clientId" class="text ui-widget-content ui-corner-all" 
               value = "{{ eitherVal authConfig.clientId Defaults.PublicWPOAuth2Api.ClientId }}"/>

        <label for="redirectUri">Redirect URI</label>
        <input type="text" name="redirectUri" id="redirectUri" class="text ui-widget-content ui-corner-all" 
               value = "{{ eitherVal authConfig.redirectUri Defaults.PublicWPOAuth2Api.TokenUrl }}"/>

        <label for="tokenUrl">Token URL</label>
        <input type="text" name="tokenUrl" id="tokenUrl" class="text ui-widget-content ui-corner-all" 
               value = "{{ eitherVal authConfig.tokenUrl Defaults.PublicWPOAuth2Api.TokenUrl }}"/>

        <label for="authorizeUrl">Authorize URL</label>
        <input type="text" name="authorizeUrl" id="authorizeUrl" class="text ui-widget-content ui-corner-all" 
               value = "{{ eitherVal authConfig.authorizeUrl Defaults.PublicWPOAuth2Api.AuthorizeUrl }}"/>

        <label for="authenticateUrl">Authenticate URL</label>
        <input type="text" name="authenticateUrl" id="authenticateUrl" class="text ui-widget-content ui-corner-all" 
               value = "{{ eitherVal authConfig.authenticateUrl Defaults.PublicWPOAuth2Api.AuthenticateUrl }}"/>
      `;
  }
}
