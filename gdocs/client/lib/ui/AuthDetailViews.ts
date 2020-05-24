declare var Handlebars: any;
import { ActivityIndicator } from "./ActivityIndicator";
import { View } from "./Views";

export class AuthDetailView extends View {
  activityIndicator: ActivityIndicator;
  allFields: JQuery<any>;
  readonly _authConfig: any;

  constructor(elem_or_id: any, authConfig: any = null) {
    super(elem_or_id);
    this._authConfig = authConfig || {};
  }

  get authConfig() {
    this.updateAuthConfig();
    return this._authConfig;
  }

  set authConfig(authConfig: any) {
    this.updateViews(authConfig);
  }

  protected updateAuthConfig() {}

  protected updateViews(_authConfig: any) {}

  setup(): this {
    this.rootElement.html(this.html());
    return this;
  }

  template() {
    return "";
  }

  html() {
    var template = Handlebars.compile(this.template());
    return template({
      authConfig: this._authConfig,
    });
  }
}

export class TokenAuthDetailView extends AuthDetailView {
  tokenLabel: JQuery<HTMLElement>;
  tokenElem: JQuery<HTMLElement>;
  expiresAtLabel: JQuery<HTMLElement>;
  expiresAtElem: JQuery<HTMLElement>;

  setup(): this {
    super.setup();
    this.tokenElem = this.rootElement.find("#token");
    this.tokenLabel = this.rootElement.find("label[for='token']");
    this.expiresAtElem = this.rootElement.find("#expiresAt");
    this.expiresAtLabel = this.rootElement.find("label[for='expiresAt']");
    return this;
  }

  protected updateAuthConfig() {
      this._authConfig["token"] = this.tokenElem.val() || "";
  }

  protected updateViews(_authConfig: any) {
    this.tokenElem.val(_authConfig.token || "");
  }

  template(): string {
    return `
        <label for="token">Token</label>
        <input type="text" name="token" id="token" class="text ui-widget-content ui-corner-all">
        <label for="expiresAt">Expires At</label>
        <input type="date" name="expiresAt" id="expiresAt" value="" class="text ui-widget-content ui-corner-all">
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

  setup(): this {
    super.setup();
    this.tokenUrlElem = this.rootElement.find("#tokenUrl");
    this.tokenUrlLabel = this.rootElement.find("label[for='tokenUrl']");
    this.validateUrlElem = this.rootElement.find("#validateUrl");
    this.validateUrlLabel = this.rootElement.find("label[for='validateUrl']");
    return this;
  }

  protected updateAuthConfig() {
    super.updateAuthConfig();
    this._authConfig["tokenUrl"] = this.tokenUrlElem.val() || "";
    this._authConfig["validateUrl"] = this.validateUrlElem.val() || "";
  }

  protected updateViews(_authConfig: any) {
    super.updateViews(_authConfig);
    this.tokenUrlElem.val(_authConfig.tokenUrl || "");
    this.validateUrlElem.val(_authConfig.validateUrl || "");
  }

  template(): string {
    return `
        <label for="tokenUrl">Token URL</label>
        <input type="text" name="tokenUrl" id="tokenUrl" class="text ui-widget-content ui-corner-all">
        <label for="validateUrl">Validate URL</label>
        <input type="text" name="validateUrl" id="validateUrl" class="text ui-widget-content ui-corner-all">
        <label for="token">Current Token</label>
        <input type="text" name="token" id="token" class="text ui-widget-content ui-corner-all">
        <label for="expiresAt">Expires At</label>
        <input type="date" name="expiresAt" id="expiresAt" value="" class="text ui-widget-content ui-corner-all">
        `;
  }
}
