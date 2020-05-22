import { ensureElement, setEnabled, setVisible } from "./utils";
import { Dialog } from "./Dialog";
import {
  AuthDetailView,
  TokenAuthDetailView,
  JWTAuthDetailView,
} from "./AuthDetailViews";
import {
  SiteDetailView,
  WPSiteDetailView,
  LISiteDetailView,
} from "./SiteDetailViews";
import { Nullable } from "../types";
import { SiteType, Site } from "../sites";
import { ServiceCatalog } from "../catalog";

const TOKEN_VALIDATION_FREQUENCY = 600000;
const DEFAULT_HOSTNAME = "https://wordpress.com/";
const DEFAULT_USERNAME = "panyam";

export class SiteDetailDialog extends Dialog {
  siteTypeElem: JQuery<HTMLElement>;
  authDetailElem: JQuery<HTMLElement>;
  authDetailView: AuthDetailView;
  errorMessageElem: JQuery<HTMLElement>;
  allFields: JQuery<any>;
  dialog: any;
  form: any;
  services: ServiceCatalog;

  constructor(elem_or_id: any, services: ServiceCatalog) {
    super(elem_or_id);
    this.services = services;
    this.site = null;
  }

  set selectedSiteType(siteType: SiteType) {
    if (siteType == SiteType.WORDPRESS) {
      this.siteTypeElem.val("WORDPRESS");
    } else if (siteType == SiteType.LINKEDIN) {
      this.siteTypeElem.val("LINKEDIN");
    } else if (siteType == SiteType.MEDIUM) {
      this.siteTypeElem.val("MEDIUM");
    }
    this.onSiteTypeChanged();
  }

  get selectedSiteType(): SiteType {
    var siteType = this.siteTypeElem.val();
    if (siteType == "WORDPRESS") {
      return SiteType.WORDPRESS;
    } else if (siteType == "MEDIUM") {
      return SiteType.MEDIUM;
    } else if (siteType == "LINKEDIN") {
      return SiteType.LINKEDIN;
    }
    return -1;
  }

  onSiteTypeChanged() {
    var siteType = this.selectedSiteType;
    console.log("Selected Type: ", siteType);
    // show the different view based on the type
    this.authDetailElem = this.rootElement.find(".auth_details_view");
    this.authDetailView = new AuthDetailView(this.authDetailElem);

    /*
    setEnabled(this.siteHostElem, siteType == SiteType.WORDPRESS);
    setEnabled(this.siteHostLabel, siteType == SiteType.WORDPRESS);
    if (this._site == null) {
      if (siteType == SiteType.WORDPRESS)
        this.siteHostElem.val(DEFAULT_HOSTNAME);
      else if (siteType == SiteType.MEDIUM)
        this.siteHostElem.val("https://medium.com");
      else if (siteType == SiteType.LINKEDIN)
        this.siteHostElem.val("https://linkedin.com");
    }
    */
  }

  get site() {
    return this.authDetailView.site;
  }
  set site(s: Nullable<Site>) {
    if (s != null) {
      this.selectedSiteType = s.siteType;
    } else {
      this.selectedSiteType = SiteType.WORDPRESS;
    }
    this.authDetailView.site = site;
    setEnabled(this.siteTypeElem, s == null);
  }

  get credentials(): any {
    // var siteType : string = this.siteTypeElem.val() as string;
    var username: string = this.usernameElem.val() as string;
    var password: string = this.passwordElem.val() as string;
    return {
      username: username,
      password: password,
    };
  }

  get errorMessage(): string {
    return this.errorMessageElem.html();
  }

  set errorMessage(html: string) {
    this.errorMessageElem.html(html);
  }

  get template(): string {
    return `
          <form>
            <fieldset class = "dialog_fields">
              <label for="platform">Platform</label>
              <select id = "platform">
                <option value="WORDPRESS">WordPress Blog</option>
                <option value="MEDIUM">Medium</option>
                <option value="LINKEDIN">LinkedIn</option>
              </select>

              <div class = "auth_details_view">
              </div>

              <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
              <span id = "error_message_span"></span>
            </fieldset>
          </form>
        `;
  }

  buttons(): any {
    var self = this;
    var out: any = {
      Cancel: function () {
        self.close(null);
      },
    };
    if (this._site == null) {
      out["Add Site"] = function () {
        self.close(self.site);
      };
    } else {
      out["Login"] = function () {
        self.errorMessageElem.html("");
        if (self.resolveFunc != null) {
          self.resolveFunc(self.credentials);
        }
      };
    }
    return out;
  }

  setupViews() {
    var self = this;
    this.rootElement.html(this.template);
    this.siteTypeElem = this.rootElement.find("select");
    this.siteHostElem = this.rootElement.find("#site_host");
    this.siteHostLabel = this.rootElement.find("label[for='site_host']");
    this.usernameElem = this.rootElement.find("#site_username");
    this.passwordElem = this.rootElement.find("#site_password");
    this.passwordLabel = this.rootElement.find("label[for='site_password']");
    this.errorMessageElem = this.rootElement.find("#error_message_span");
    if (this.site != null) {
      this.siteTypeElem.val(this.site.site_type);
      this.onSiteTypeChanged();
    }
    this.siteTypeElem.change(function (evt: any) {
      self.onSiteTypeChanged();
    });

    this.allFields = $([]).add(this.siteTypeElem);
    this.dialog = this.rootElement.dialog({
      autoOpen: false,
      position: { my: "center top", at: "center top", of: window },
      modal: true,
      close: function () {
        self.form[0].reset();
        self.allFields.removeClass("ui-state-error");
      },
    });

    this.form = this.dialog.find("form").on("submit", function (event: any) {
      event.preventDefault();
    });

    return this;
  }

  /** LoginProvider interface */
  async ensureLoggedIn(site: Site) {
    while (true) {
      site.config.token = site.config.token || null;
      if (site.config.token == null) {
        this.site = site;
        var credentials: any = await this.open();
        if (credentials == null) return false;
        try {
          site.config.token = await gateway.loginToWordpress(site, credentials);
          this.close();
          if (site.config.token == null) {
            // cancelled
            return false;
          } else {
            site.config.tokenTimestamp = Date.now();
            // Save what we have so far
            await this.services.siteService.saveSite(site);
          }
        } catch (e) {
          console.log("Received Exception: ", e);
          var resjson = e.responseJSON || {};
          var message = resjson.message || e.statusText;
          this.errorMessage = message;
        }
      }

      if (site.config.token != null) {
        // validate token if too old needed
        var validatedDelta = Date.now() - (site.config.tokenValidatedAt || 0);
        if (validatedDelta > TOKEN_VALIDATION_FREQUENCY) {
          var validated = await gateway.validateToken(site);
          if (validated) {
            await this.services.siteService.saveSite(site);
            return true;
          } else {
            // validation failed - may be token is invalid
            site.config.token = null;
          }
        } else {
          return true;
        }
      }
    }
    return true;
  }
}
