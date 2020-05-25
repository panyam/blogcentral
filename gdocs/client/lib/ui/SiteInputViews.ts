import { AuthType, SiteType } from "../interfaces";
import { Nullable } from "../types";
import { View } from "./Views";
import {
  AuthDetailView,
  TokenAuthDetailView,
  JWTAuthDetailView,
  OAuth2AuthDetailView,
} from "./AuthDetailViews";
import { Site } from "../sites";
import { ActivityIndicator } from "./ActivityIndicator";

export function createSiteInputView(siteType: SiteType, elem_or_id: any) {
  if (siteType == SiteType.WORDPRESS) {
    return new WPSiteInputView(elem_or_id).setup();
  } else if (siteType == SiteType.MEDIUM) {
    return new MediumSiteInputView(elem_or_id).setup();
  } else if (siteType == SiteType.LINKEDIN) {
    return new LISiteInputView(elem_or_id).setup();
  }
  throw new Error("Unsupported Site Type: " + siteType);
}

export class SiteInputView extends View<Site> {
  activityIndicator: ActivityIndicator;
  allFields: JQuery<any>;
  authDetailElem: any;
  authDetailView: AuthDetailView;

  constructor(elem_or_id: any, site: Nullable<Site> = null) {
    super(elem_or_id, site || Site.defaultSite());
  }

  setupViews() {
    super.setupViews();
    this.authDetailElem = this.rootElement.find(".auth_details_view");
  }

  get selectedAuthType(): AuthType {
    return -1;
  }

  onAuthTypeChanged() {
    var authType = this.selectedAuthType;
    console.log("Selected Type: ", authType);

    // show the different view based on the type
    this.authDetailElem = this.rootElement.find(".auth_details_view");
    if (authType == AuthType.OAUTH2) {
      this.authDetailView = new OAuth2AuthDetailView(
        this.authDetailElem
      ).setup();
    } else if (authType == AuthType.TOKEN) {
      this.authDetailView = new TokenAuthDetailView(
        this.authDetailElem
      ).setup();
    } else if (authType == AuthType.JWT) {
      this.authDetailView = new JWTAuthDetailView(this.authDetailElem).setup();
    }
  }
}

export class WPSiteInputView extends SiteInputView {
  titleElem: any;
  apiUrlElem: any;
  authTypeElem: any;

  setupViews(self: this = this) {
    super.setupViews();
    this.titleElem = this.rootElement.find("#title");
    this.apiUrlElem = this.rootElement.find("#apiUrl");
    this.authTypeElem = this.rootElement.find("#authType");
    this.authTypeElem.change(function (_evt: any) {
      self.onAuthTypeChanged();
    });
    this.onAuthTypeChanged();
  }

  protected extractEntity() {
    return new Site(this.titleElem.val() || "", {
      siteType: SiteType.WORDPRESS,
      siteConfig: {
        apiUrl: this.apiUrlElem.val() || "",
      },
      authType: this.selectedAuthType,
      authConfig: this.authDetailView.entity,
    });
  }

  protected updateViewsFromEntity(site: Site) {
    if (site.siteType != SiteType.WORDPRESS) {
      throw new Error("Only Wordpress Sites can be rendered with this view");
    }
    this.titleElem.val(site.title || "My Example Site");
    this.apiUrlElem.val(site.siteConfig.apiUrl || "https://examplesite.com/");
  }

  html(): string {
    return `
        <label for="title">Title</label>
        <input type="text" name="title" id="title" class="text ui-widget-content ui-corner-all" />
        <label for="apiUrl">API Endpoint</label>
        <input type="text" name="apiUrl" id="apiUrl" class="text ui-widget-content ui-corner-all" />
        
        <label for="authType">Auth</label>
        <select id = "authType">
            <option value="JWT">JWT</option>
            <option value="OAUTH2">OAuth2</option>
        </select>
        <div class = "auth_details_view"></div>
      `;
  }

  get selectedAuthType(): AuthType {
    var authType = this.authTypeElem.val();
    if (authType == "OAUTH2") {
      return AuthType.OAUTH2;
    } else if (authType == "JWT") {
      return AuthType.JWT;
    }
    return -1;
  }

  set selectedAuthType(authType: AuthType) {
    if (authType == AuthType.OAUTH2) {
      this.authTypeElem.val("OAUTH2");
    } else if (authType == AuthType.JWT) {
      this.authTypeElem.val("JWT");
    }
    this.onAuthTypeChanged();
  }
}

export class LISiteInputView extends SiteInputView {
  titleElem: any;
  usernameElem: any;

  setupViews() {
    super.setupViews();
    this.titleElem = this.rootElement.find("#title");
    this.usernameElem = this.rootElement.find("#username");
  }

  protected extractEntity() {
    return new Site(this.titleElem.val() || "", {
      siteType: SiteType.LINKEDIN,
      siteConfig: {},
      authType: AuthType.TOKEN,
      authConfig: {
        username: this.usernameElem.val() || "",
      },
    });
  }

  protected updateViewsFromEntity(site: Site) {
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

  setupViews() {
    super.setupViews();
    this.titleElem = this.rootElement.find("#title");
    this.usernameElem = this.rootElement.find("#username");
    var authDetailElem = this.rootElement.find("#auth_details_view");
    this.authDetailView = new TokenAuthDetailView(authDetailElem).setup();
  }

  protected extractEntity() {
    return new Site(this.titleElem.val() || "", {
      siteType: SiteType.MEDIUM,
      siteConfig: {
        username: this.usernameElem.val() || "",
      },
      authType: AuthType.TOKEN,
      authConfig: this.authDetailView.entity,
    });
  }

  protected updateViewsFromEntity(site: Site) {
    if (site.siteType != SiteType.WORDPRESS) {
      throw new Error("Only Wordpress Sites can be rendered with this view");
    }
    this.titleElem.val(site.title || "");
    this.usernameElem.val(site.siteConfig.username || "");
    this.authDetailView.entity = site.authConfig;
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
