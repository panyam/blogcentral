import "../../styles/SiteInputView";
import { Nullable } from "../types";
import { View } from "./Views";
import { SiteManager, Site, SiteConfig } from "../siteapis";
import { AuthConfig, AuthType } from "../authclients";
import { ActivityIndicator } from "./ActivityIndicator";
import { AuthDetailView } from "./AuthDetailViews";

export abstract class SiteInputView extends View<Site> {
  titleElem: any;
  activityIndicator: ActivityIndicator;
  authDetailElem: any;
  authDetailView: AuthDetailView;
  authTypeElem: any;
  siteManager: SiteManager;

  constructor(
    elem_or_id: any,
    siteManager: SiteManager,
    site: Nullable<Site> = null
  ) {
    super(elem_or_id, "site", site);
    this.siteManager = siteManager;
  }

  setupViews(self: this = this) {
    super.setupViews();
    this.titleElem = this.findElement("#title");
    this.authDetailElem = this.findElement(".auth_details_view");
    this.authTypeElem = this.findElement("#authType");
    this.authTypeElem.change(function (_evt: any) {
      self.onAuthTypeChanged();
    });
  }

  get selectedAuthType(): AuthType {
    return this.authTypeElem.val() as AuthType;
  }

  set selectedAuthType(authType: AuthType) {
    this.authTypeElem.val(authType);
    this.onAuthTypeChanged();
  }

  protected extractEntity() {
    return new Site(
      this.titleElem.val() || "",
      this.siteConfig,
      this.authConfig
    );
  }

  abstract get siteConfig(): SiteConfig;
  get authConfig(): AuthConfig {
    return this.authDetailView.entity!!;
  }

  onAuthTypeChanged() {
    var authType = this.selectedAuthType;
    console.log("Selected Type: ", authType);

    // show the different view based on the type
    this.authDetailElem = this.findElement(".auth_details_view");
    if (this.authDetailElem.length == 0) {
      var mesg =
        "Could not find div with class 'auth_details_view' to create auth view in.";
      console.log(mesg);
      // throw new Error(mesg);
      return;
    }
    var site = this._entity;
    if (site != null && site.authType == authType) {
      var authManager = this.siteManager.app.managerForAuth(site.authType);
      this.authDetailView = authManager.createAuthView(
        "",
        this.authDetailElem,
        null
      ) as AuthDetailView;
      this.authDetailView.entity = site.authConfig;
    }
  }
}
