import { AuthDetailView } from "../ui/AuthDetailViews";
import { AUTH_TYPE_OAUTH2 } from "./core";
import { setVisible } from "../ui/utils";

export class OAuth2AuthDetailView extends AuthDetailView {
  authBaseUrlLabel: JQuery<HTMLElement>;
  authBaseUrlElem: JQuery<HTMLElement>;
  clientIdLabel: JQuery<HTMLElement>;
  clientIdElem: JQuery<HTMLElement>;
  tokenUrlLabel: JQuery<HTMLElement>;
  tokenUrlElem: JQuery<HTMLElement>;
  authorizeUrlLabel: JQuery<HTMLElement>;
  authorizeUrlElem: JQuery<HTMLElement>;
  authenticateUrlLabel: JQuery<HTMLElement>;
  authenticateUrlElem: JQuery<HTMLElement>;

  setupViews() {
    super.setupViews();
    this.authBaseUrlElem = this.rootElement.find("#authBaseUrl");
    this.authBaseUrlLabel = this.rootElement.find("label[for='authBaseUrl']");
    this.clientIdElem = this.rootElement.find("#clientId");
    this.clientIdLabel = this.rootElement.find("label[for='clientId']");
    this.tokenUrlElem = this.rootElement.find("#tokenUrl");
    this.tokenUrlLabel = this.rootElement.find("label[for='tokenUrl']");
    this.authorizeUrlElem = this.rootElement.find("#authorizeUrl");
    this.authorizeUrlLabel = this.rootElement.find("label[for='authorizeUrl']");
    this.authenticateUrlElem = this.rootElement.find("#authenticateUrl");
    this.authenticateUrlLabel = this.rootElement.find(
      "label[for='authenticateUrl']"
    );
  }

  elementsFor(fieldName : string) : any[] { 
    if (fieldName == "tokenUrl") {
      return [this.tokenUrlLabel, this.tokenUrlElem]
    } else if (fieldName == "authBaseUrl") {
      return [this.authBaseUrlLabel, this.authBaseUrlElem]
    } else if (fieldName == "authorizeUrl") {
      return [this.authorizeUrlLabel, this.authorizeUrlElem]
    } else if (fieldName == "authenticateUrl") {
      return [this.authenticateUrlLabel, this.authenticateUrlElem]
    } else if (fieldName == "clientId") {
      return [this.clientIdLabel, this.clientIdElem]
    }
    return super.elementsFor(fieldName);
  }

  extractEntity() {
    var out = { authType: AUTH_TYPE_OAUTH2 }
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
