declare var Handlebars: any;
import { ensureElement, setEnabled, setVisible } from "./utils";
import { Nullable } from "../types";
import { Site } from "../models";
import { ActivityIndicator } from "./ActivityIndicator";

export class LoginDetailsView {
  rootElement: any;
  activityIndicator: ActivityIndicator;
  allFields: JQuery<any>;
  _site: Nullable<Site> = null;

  constructor(elem_or_id: any, site: Site) {
    this.rootElement = ensureElement(elem_or_id);
    this.setupViews();
    this.site = null;
  }

  get site(): Nullable<Site> {
    return null;
  }

  set site(s: Nullable<Site>) {
    this._site = s;
    this.onSiteChanged();
  }

  onSiteChanged() {}

  setupViews() {
    var siteTemplate = Handlebars.compile(this.template);
    var html = siteTemplate({
      site: this._site,
    });
    this.rootElement.html(html);
  }

  get template() {
    return "";
  }
}

/**
 * A view to capture details about logging into publicly hosted wordpress site.
 */
export class WPJWTLoginView extends LoginDetailsView {
  siteHostLabel: JQuery<HTMLElement>;
  siteHostElem: JQuery<HTMLElement>;
  usernameElem: JQuery<HTMLElement>;
  passwordElem: JQuery<HTMLElement>;

  setupViews() {
    super.setupViews();
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
