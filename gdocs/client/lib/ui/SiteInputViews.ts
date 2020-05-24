declare var Handlebars: any;
import { AuthType, SiteType } from "../interfaces";
import { Nullable } from "../types";
import { View } from "./Views";
import { TokenAuthDetailView } from "./AuthDetailViews"
import { Site } from "../sites";
import { ActivityIndicator } from "./ActivityIndicator";

export class SiteInputView extends View {
  activityIndicator: ActivityIndicator;
  allFields: JQuery<any>;
  _site: Site;

  constructor(elem_or_id: any, site: Nullable<Site> = null) {
    super(elem_or_id);
    this._site = site || Site.defaultSite();
  }

  get site() {
    this.updateSite();
    return this._site;
  }

  set site(site: Site) {
    this.updateViews(site);
  }

  protected updateSite() {}

  protected updateViews(_site: Site) {}
}

export class WPSiteInputView extends SiteInputView {
  titleElem: any;
  apiUrlElem: any;

  setup(): this {
    super.setup();
    this.titleElem = this.rootElement.find("#title");
    this.apiUrlElem = this.rootElement.find("#apiUrl");
    return this;
  }

  protected updateSite() {
    this._site = new Site(this.titleElem.val() || "", {
      siteType: SiteType.WORDPRESS,
      siteConfig: {
        apiUrl: this.apiUrlElem.val() || "",
      },
    });
  }

  protected updateViews(site: Site) {
    if (site.siteType != SiteType.WORDPRESS) {
      throw new Error("Only Wordpress Sites can be rendered with this view");
    }
    this.titleElem.val(site.title || "");
    this.apiUrlElem.val(site.siteConfig.apiUrl || "");
  }

  html(): string {
    return `
        <label for="title">Title</label>
        <input type="text" name="title" id="title" class="text ui-widget-content ui-corner-all" value = "My Amazing Site" />
        <label for="apiUrl">API Endpoint</label>
        <input type="text" name="apiUrl" id="apiUrl" class="text ui-widget-content ui-corner-all" value = "https://examplesite.com/wp-json/" />
      `;
  }
}

export class LISiteInputView extends SiteInputView {
  titleElem: any;
  usernameElem: any;

  setup(): this {
    super.setup();
    this.titleElem = this.rootElement.find("#title");
    this.usernameElem = this.rootElement.find("#username");
    return this;
  }

  protected updateSite() {
    this._site = new Site(this.titleElem.val() || "", {
      siteType: SiteType.LINKEDIN,
      siteConfig: {},
      authType: AuthType.TOKEN,
      authConfig: {
        username: this.usernameElem.val() || "",
      },
    });
  }

  protected updateViews(site: Site) {
    if (site.siteType != SiteType.WORDPRESS) {
      throw new Error("Only Wordpress Sites can be rendered with this view");
    }
    this.titleElem.val(site.title || "");
    this.usernameElem.val(site.authConfig.username || "");
  }

  html(): string {
    return `
        <label for="title">Title</label>
        <input type="text" name="title" id="title" class="text ui-widget-content ui-corner-all" value = "My Medium Site" />
        <label for="username">Username</label>
        @<input type="text" name="title" id="username" class="text ui-widget-content ui-corner-all" value = "mediumuser" />
        `;
  }
}

export class MediumSiteInputView extends SiteInputView {
  titleElem: any;
  usernameElem: any;
  authDetailView : TokenAuthDetailView

  setup(): this {
    super.setup();
    this.titleElem = this.rootElement.find("#title");
    this.usernameElem = this.rootElement.find("#username");
    var authDetailElem = this.rootElement.find("#auth_details_view");
    this.authDetailView = new TokenAuthDetailView(authDetailElem).setup();
    return this;
  }

  protected updateSite() {
    this._site = new Site(this.titleElem.val() || "", {
      siteType: SiteType.MEDIUM,
      siteConfig: {
        username: this.usernameElem.val() || "",
      },
      authType: AuthType.TOKEN,
      authConfig: this.authDetailView.authConfig
    });
  }

  protected updateViews(site: Site) {
    if (site.siteType != SiteType.WORDPRESS) {
      throw new Error("Only Wordpress Sites can be rendered with this view");
    }
    this.titleElem.val(site.title || "");
    this.usernameElem.val(site.siteConfig.username || "");
    this.authDetailView.authConfig = site.authConfig;
  }

  html(): string {
    return `
        <label for="title">Title</label>
        <input type="text" name="title" id="title" class="text ui-widget-content ui-corner-all" value = "My Medium Site" />
        <label for="username">Username</label>
        <input type="text" name="title" id="username" class="text ui-widget-content ui-corner-all" value = "mediumuser" />

        <div id = "auth_details_view"> </div>
        `;
  }
}
