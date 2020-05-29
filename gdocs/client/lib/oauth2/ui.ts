import { AuthDetailView } from "../ui/AuthDetailViews";

export class OAuth2AuthDetailView extends AuthDetailView {
  authBaseUrlLabel: JQuery<HTMLElement>;
  authBaseUrlElem: JQuery<HTMLElement>;
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
    this.tokenUrlElem = this.rootElement.find("#tokenUrl");
    this.tokenUrlLabel = this.rootElement.find("label[for='tokenUrl']");
    this.authorizeUrlElem = this.rootElement.find("#authorizeUrl");
    this.authorizeUrlLabel = this.rootElement.find("label[for='authorizeUrl']");
    this.authenticateUrlElem = this.rootElement.find("#authenticateUrl");
    this.authenticateUrlLabel = this.rootElement.find(
      "label[for='authenticateUrl']"
    );
  }

  template(): string {
    return `
        <label for="authBaseUrl">Auth Base Url</label>
        <input type="text" name="authBaseUrl" id="authBaseUrl" 
               class="text ui-widget-content ui-corner-all" 
               value = "{{eitherVal authConfig.authBaseUrl Defaults.PublicWPOAuth2Api.AuthBaseUrl }}"/>

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
