import "../../styles/SiteInputView";
import { AuthType, SiteType } from "../enums";
import { Nullable } from "../types";
import { View } from "./Views";
import { setEnabled } from "./utils";
import {
  AuthDetailView,
  TokenAuthDetailView,
  JWTAuthDetailView,
  OAuth2AuthDetailView,
} from "./AuthDetailViews";
import { Site } from "../models";
import { defaultSite } from "../defaults";
import { ActivityIndicator } from "./ActivityIndicator";

export function createSiteInputView(siteType: SiteType, elem_or_id: any) {
  if (siteType == SiteType.PUBLIC_WORDPRESS) {
    return new PublicWPSiteInputView(elem_or_id).setup();
  } else if (siteType == SiteType.HOSTED_WORDPRESS) {
    return new HostedWPSiteInputView(elem_or_id).setup();
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
  authTypeElem: any;

  constructor(elem_or_id: any, site: Nullable<Site> = null) {
    super(elem_or_id, "site", site || defaultSite());
  }

  setupViews(self: this = this) {
    super.setupViews();
    this.authDetailElem = this.rootElement.find(".auth_details_view");
    this.authTypeElem = this.rootElement.find("#authType");
    this.authTypeElem.change(function (_evt: any) {
      self.onAuthTypeChanged();
    });
  }

  get selectedAuthType(): AuthType {
    var authType = this.authTypeElem.val();
    if (authType == "OAUTH2") {
      return AuthType.OAUTH2;
    } else if (authType == "TOKEN") {
      return AuthType.TOKEN;
    } else if (authType == "JWT") {
      return AuthType.JWT;
    }
    return -1;
  }

  set selectedAuthType(authType: AuthType) {
    if (authType == AuthType.OAUTH2) {
      this.authTypeElem.val("OAUTH2");
    } else if (authType == AuthType.TOKEN) {
      this.authTypeElem.val("TOKEN");
    } else if (authType == AuthType.JWT) {
      this.authTypeElem.val("JWT");
    }
    this.onAuthTypeChanged();
  }

  onAuthTypeChanged() {
    var authType = this.selectedAuthType;
    console.log("Selected Type: ", authType);

    // show the different view based on the type
    this.authDetailElem = this.rootElement.find(".auth_details_view");
    if (this.authDetailElem.length == 0) {
      var mesg =
        "Could not find div with class 'auth_details_view' to create auth view in.";
      console.log(mesg);
      // throw new Error(mesg);
      return;
    }
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
    var site = this._entity!!;
    if (site.authType == authType) {
      this.authDetailView.entity = site.authConfig;
    }
  }
}

export class PublicWPSiteInputView extends SiteInputView {
  titleElem: any;
  siteUrlElem: any;

  setupViews() {
    super.setupViews();
    this.titleElem = this.rootElement.find("#title");
    this.siteUrlElem = this.rootElement.find("#siteUrl");
    this.onAuthTypeChanged();
  }

  get selectedAuthType(): AuthType {
    return AuthType.OAUTH2;
  }

  protected extractEntity() {
    return new Site(this.titleElem.val() || "", {
      siteType: SiteType.PUBLIC_WORDPRESS,
      siteConfig: {
        siteUrl: this.siteUrlElem.val() || "",
      },
      authType: this.selectedAuthType,
      authConfig: {},
    });
  }

  template(): string {
    return `
        <label for="title">Title</label>
        <input type="text" name="title" id="title" 
               value = "{{eitherVal this.site.title Defaults.PublicWPRestApi.Title }}"
               class="text ui-widget-content ui-corner-all" />
        <label for="siteUrl">Site URL</label>
        <input type="text" name="siteUrl" 
               id="siteUrl" class="text ui-widget-content ui-corner-all" 
               value = "{{eitherVal this.site.siteConfig.siteUrl Defaults.PublicWPRestApi.SiteUrl }}"
               />
      `;
  }
}

export class HostedWPSiteInputView extends SiteInputView {
  titleElem: any;
  apiUrlElem: any;

  setupViews() {
    super.setupViews();
    this.titleElem = this.rootElement.find("#title");
    this.apiUrlElem = this.rootElement.find("#apiUrl");
    this.onAuthTypeChanged();
  }

  protected extractEntity() {
    return new Site(this.titleElem.val() || "", {
      siteType: SiteType.HOSTED_WORDPRESS,
      siteConfig: {
        apiUrl: this.apiUrlElem.val() || "",
      },
      authType: this.selectedAuthType,
      authConfig: this.authDetailView.entity,
    });
  }

  template(): string {
    return `
        <label for="title">Title</label>
        <input type="text" name="title" id="title" 
               value = "{{eitherVal this.site.title Defaults.HostedWPRestApi.Title }}"
               class="text ui-widget-content ui-corner-all" />
        <label for="apiUrl">API Endpoint</label>
        <input type="text" name="apiUrl" 
               id="apiUrl" class="text ui-widget-content ui-corner-all" 
               value = "{{eitherVal this.site.siteConfig.apiUrl Defaults.HostedWPRestApi.ApiUrl }}"
               />
        
        <hr/>

        <label class = "auth_type_label" for="authType">Auth</label>
        <select id = "authType">
            <option value="JWT">Username/Password</option>
            <option value="OAUTH2">OAuth2</option>
        </select>
        <div class = "auth_details_view"></div>
      `;
  }
}

export class LISiteInputView extends SiteInputView {
  titleElem: any;
  usernameElem: any;

  setupViews() {
    super.setupViews();
    this.titleElem = this.rootElement.find("#title");
    this.usernameElem = this.rootElement.find("#username");
    this.onAuthTypeChanged();
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

  template(): string {
    return `
        <label for="title">Title</label>
        <input type="text" name="title" id="title" class="text ui-widget-content ui-corner-all" value = "My Medium Site" />
        <label for="username">Username</label>
        @<input type="text" name="title" id="username" class="text ui-widget-content ui-corner-all" value = "mediumuser" />

        <div class = "auth_details_view"></div>
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
    this.onAuthTypeChanged();
  }

  onAuthTypeChanged() {
    super.onAuthTypeChanged();
    var tadv = this.authDetailView as TokenAuthDetailView;
    tadv.authBaseUrlElem.val("https://api.medium.com/v1");
    setEnabled(tadv.authBaseUrlElem, false);
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

  template(): string {
    return `
        <label for="title">Title</label>
        <input type="text" name="title" id="title" class="text ui-widget-content ui-corner-all" value = "My Medium Site" />
        <label for="username">Username</label>
        <input type="text" name="title" id="username" class="text ui-widget-content ui-corner-all" value = "mediumuser" />

        <hr/>
        <label class = "auth_type_label" for="authType">Auth</label>
        <select id = "authType">
            <option value="TOKEN">Integration Tokens</option>
            <option value="OAUTH2">OAuth2</option>
        </select>
        <div class = "auth_details_view"></div>
        `;
  }
}
