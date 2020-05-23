declare var Handlebars: any;
import { ensureElement, setEnabled, setVisible } from "./utils";
import { Nullable } from "../types";
import { ActivityIndicator } from "./ActivityIndicator";
import { View } from "./Views";

export class AuthDetailView extends View {
  activityIndicator: ActivityIndicator;
  allFields: JQuery<any>;
  readonly authConfig: any;

  constructor(elem_or_id: any, authConfig: any = null) {
    super(elem_or_id);
    this.authConfig = authConfig || {};
  }

  onSiteChanged() {}

  setupViews() {
    var template = Handlebars.compile(this.template);
    var html = template({
      site: this.authConfig,
    });
    this.rootElement.html(html);
    return this;
  }

  get template() {
    return "";
  }
}

export class TokenAuthDetailView extends AuthDetailView {
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
    return this;
  }

  onSiteChanged() {
    var ac = this.authConfig;
    this.tokenElem.val(ac.token || "");
    this.expiresAtElem.val(ac.tokenExpiresAt || "");
  }

  get template(): string {
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

  setupViews() {
    super.setupViews();
    this.tokenUrlElem = this.rootElement.find("#tokenUrl");
    this.tokenUrlLabel = this.rootElement.find("label[for='tokenUrl']");
    this.validateUrlElem = this.rootElement.find("#validateUrl");
    this.validateUrlLabel = this.rootElement.find("label[for='validateUrl']");
    return this;
  }

  onSiteChanged() {
    var ac = this.authConfig;
    super.onSiteChanged();
    this.tokenUrlElem.val(ac.tokenUrl || "");
    this.validateUrlElem.val(ac.validateUrl || "");
  }

  get template(): string {
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
