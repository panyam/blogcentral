
import { AuthDetailView } from "../ui/AuthDetailViews";
import { valOrDefault } from "../utils";

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
