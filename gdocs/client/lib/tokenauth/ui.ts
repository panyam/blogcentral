import { AuthDetailView } from "../ui/AuthDetailViews";
import { AUTH_TYPE_TOKEN } from "./core";
import { ITokenAuthDetailView} from "./interfaces"

export class TokenAuthDetailView extends AuthDetailView implements ITokenAuthDetailView {
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

  get token() { return this.tokenElem.val() as string; }
  set token(t : string) { this.tokenElem.val(t); }
  get authBaseUrl() { return this.authBaseUrlElem.val() as string; }
  set authBaseUrl(t : string) { this.authBaseUrlElem.val(t); }

  elementsFor(fieldName : string) : any[] { 
    if (fieldName == "authBaseUrl") {
        return [ this.authBaseUrlLabel, this.authBaseUrlElem ];
    }
    return []
  }

  extractEntity() {
    var out = {
      authType: AUTH_TYPE_TOKEN,
      token: this.tokenElem.val() || "",
    } as any;
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
