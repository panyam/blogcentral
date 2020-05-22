declare var Handlebars: any;
import { ensureElement, setEnabled, setVisible } from "./utils";
import { Nullable } from "../types";
import { Site } from "../sites";
import { ActivityIndicator } from "./ActivityIndicator";

export class SiteDetailView {
  rootElement: any;
  activityIndicator: ActivityIndicator;
  allFields: JQuery<any>;
  readonly site: Site;

  constructor(elem_or_id: any, site: Nullable<Site> = null) {
    this.rootElement = ensureElement(elem_or_id);
    this.setupViews();
    this.site = site || new Site({});
  }

  onSiteChanged() {}

  setupViews() {
    var template = Handlebars.compile(this.template);
    var html = template({
      site: this.site,
    });
    this.rootElement.html(html);
  }

  get template() {
    return "";
  }
}

export class WPSiteDetailView extends SiteDetailView {
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
  }

  onSiteChanged() {
    var s = this.site;
    this.tokenElem.val(s.token || "");
    this.expiresAtElem.val(s.tokenExpiresAt || "");
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
export class LISiteDetailView extends SiteDetailView {
  tokenLabel: JQuery<HTMLElement>;
  tokenElem: JQuery<HTMLElement>;

  setupViews() {
    super.setupViews();
    this.tokenElem = this.rootElement.find("#token");
    this.tokenLabel = this.rootElement.find("label[for='token']");
  }

  onSiteChanged() {
    var s = this._site;
    if (s != null) {
      this.usernameElem.val(s.username);
      this.siteHostElem.val(s.site_host);
    } else {
      this.usernameElem.val(DEFAULT_USERNAME);
      this.passwordElem.val("");
    }
    setEnabled(this.siteHostElem, s == null);
    setVisible(this.passwordElem, s != null);
    setVisible(this.passwordLabel, s != null);
  }

  get template(): string {
    return `
          <form>
            <fieldset class = "dialog_fields">
              <label for="site_host"></label>
              <input type="url" name="site_host" id="site_host" class="text ui-widget-content ui-corner-all">

              <label for="site_username">Username</label>
              <input type="text" name="site_username" id="site_username" class="text ui-widget-content ui-corner-all">

              <label for="site_password">Password</label>
              <input type="password" name="site_password" 
                     id="site_password" 
                     value=""
                     class="text ui-widget-content ui-corner-all">


              <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
              <span id = "error_message_span"></span>
            </fieldset>
          </form>
        `;
  }
}
