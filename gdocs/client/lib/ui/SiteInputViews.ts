import "../../styles/SiteInputView";
import { Nullable } from "../types";
import { View } from "./Views";
import {
  AuthDetailView,
  TokenAuthDetailView,
  LoginAuthDetailView,
  OAuth2AuthDetailView,
} from "./AuthDetailViews";
import { Site } from "../models";
import { defaultSite } from "../defaults";
import { ActivityIndicator } from "./ActivityIndicator";

export class SiteInputView extends View<Site> {
  activityIndicator: ActivityIndicator;
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
    } else if (authType == "LOGIN") {
      return AuthType.LOGIN;
    }
    return -1;
  }

  set selectedAuthType(authType: AuthType) {
    if (authType == AuthType.OAUTH2) {
      this.authTypeElem.val("OAUTH2");
    } else if (authType == AuthType.TOKEN) {
      this.authTypeElem.val("TOKEN");
    } else if (authType == AuthType.LOGIN) {
      this.authTypeElem.val("LOGIN");
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
    } else if (authType == AuthType.LOGIN) {
      this.authDetailView = new LoginAuthDetailView(this.authDetailElem).setup();
    }
    var site = this._entity!!;
    if (site.authType == authType) {
      this.authDetailView.entity = site.authConfig;
    }
  }
}
