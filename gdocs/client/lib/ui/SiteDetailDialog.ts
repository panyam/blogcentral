import { setEnabled } from "./utils";
import { FormDialog } from "./Dialog";
import {
  SiteDetailView,
  WPSiteDetailView,
  MediumSiteDetailView,
  LISiteDetailView,
} from "./SiteDetailViews";
import { Nullable } from "../types";
import { SiteType, Site } from "../sites";
import { ServiceCatalog } from "../catalog";

const TOKEN_VALIDATION_FREQUENCY = 600000;
const DEFAULT_HOSTNAME = "https://wordpress.com/";
const DEFAULT_USERNAME = "panyam";

export class SiteDetailDialog extends FormDialog {
  siteTypeElem: JQuery<HTMLElement>;
  siteDetailElem: JQuery<HTMLElement>;
  siteDetailView: SiteDetailView;
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
    this.siteDetailElem = this.rootElement.find(".site_details_view");
    this.siteDetailView = new SiteDetailView(this.siteDetailElem);

    if (siteType == SiteType.WORDPRESS)
      this.siteDetailView = new WPSiteDetailView(this.siteDetailElem);
    else if (siteType == SiteType.MEDIUM)
      this.siteDetailView = new MediumSiteDetailView(this.siteDetailElem);
    else if (siteType == SiteType.LINKEDIN)
      this.siteDetailView = new LISiteDetailView(this.siteDetailElem);
  }

  get site() {
    return this.siteDetailView.site;
  }
  set site(s: Nullable<Site>) {
    if (s != null) {
      this.selectedSiteType = s.siteType;
    } else {
      this.selectedSiteType = SiteType.WORDPRESS;
    }
    setEnabled(this.siteTypeElem, s == null);
  }

  get template(): string {
    return `
        <label for="platform">Platform</label>
        <select id = "platform">
            <option value="WORDPRESS">WordPress Blog</option>
            <option value="MEDIUM">Medium</option>
            <option value="LINKEDIN">LinkedIn</option>
        </select>
        <div class = "site_details_view"></div>
    `;
  }

  buttons(): any {
    var self = this;
    var out: any = {
      Cancel: function () {
        self.close(null);
      },
    };
    if (this.site == null) {
      out["Add Site"] = function () {
        self.close(self.site);
      };
    } else {
      out["Login"] = function () {
        self.errorMessageElem.html("");
        if (self.resolveFunc != null) {
          self.resolveFunc(null /*self.credentials*/);
        }
      };
    }
    return out;
  }

  setupViews() {
    var self = super.setupViews();
    this.allFields.add(this.siteTypeElem);
    this.siteTypeElem = this.rootElement.find("select");
    if (this.site != null) {
      this.selectedSiteType = this.site.siteType;
      this.onSiteTypeChanged();
    }
    this.siteTypeElem.change(function (_evt: any) {
      self.onSiteTypeChanged();
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
