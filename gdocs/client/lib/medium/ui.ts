import { SiteInputView } from "../ui/SiteInputViews";
import { SiteSummaryView } from "../ui/SiteSummaryViews";
import { SiteConfig } from "../siteapis";
import { SITE_TYPE_MEDIUM } from "./core";
import { ITokenAuthDetailView } from "../tokenauth/interfaces";
import { IOAuth2AuthDetailView } from "../oauth2/interfaces";
import { TokenAuthConfig } from "../tokenauth/client";
import { OAuth2AuthConfig } from "../oauth2/client";
import { AUTH_TYPE_OAUTH2 } from "../oauth2/core";

declare var redirectUriForSite: (site: string) => string;

export class MediumSiteInputView extends SiteInputView {
  usernameElem: any;

  setupViews() {
    super.setupViews();
    this.usernameElem = this.findElement("#username");
    this.onAuthTypeChanged();
  }

  get authConfig(): OAuth2AuthConfig | TokenAuthConfig {
    if (this.selectedAuthType == AUTH_TYPE_OAUTH2) {
      return {
        authType: "AUTH_TYPE_OAUTH2",
        clientId: "1d26e3f346e",
        scope: "basicProfile,listPublications,publishPost",
        redirectUri: "https://blogcentral.appspot.com/oauth2/medium/redirect", // redirectUriForSite("medium"),
        responseType: "code", // Avoid Implicit grants for now
        tokenUrl: "https://medium.com/v1/tokens",
        authorizeUrl: "https://medium.com/m/oauth/authorize",
        authenticateUrl: "https://medium.com/m/oauth/authenticate",
      };
    } else {
      return this.authDetailView.entity;
    }
  }

  onAuthTypeChanged() {
    super.onAuthTypeChanged();
    var authType = this.selectedAuthType;
    this.authDetailView.showField("authBaseUrl", false);
    if (authType == "AUTH_TYPE_TOKEN") {
      var tadv = (this.authDetailView as unknown) as ITokenAuthDetailView;
      /*
    var tadv = this.authDetailView as TokenAuthDetailView;
    tadv.authBaseUrlElem.val("https://api.medium.com/v1");
    setEnabled(tadv.authBaseUrlElem, false);
   */
    } else {
      var oadv = (this.authDetailView as unknown) as IOAuth2AuthDetailView;
      oadv.showField("clientId", false);
      oadv.showField("tokenUrl", false);
      oadv.showField("redirectUri", false);
      oadv.showField("authorizeUrl", false);
      oadv.showField("authenticateUrl", false);
    }
  }

  get siteConfig() {
    return {
      siteType: SITE_TYPE_MEDIUM,
      username: this.username,
    } as SiteConfig;
  }

  get username() {
    return this.usernameElem.val() || "";
  }

  template(): string {
    return `
        <label for="title">Title</label>
        <input type="text" name="title" id="title" class="text ui-widget-content ui-corner-all"
               value = "{{eitherVal this.site.title Defaults.MediumRestApi.Title }}"
               />

        <label for="username">Username</label>
        <input type="text" name="title" id="username" class="text ui-widget-content ui-corner-all" 
               value = "{{eitherVal this.site.siteConfig.username Defaults.MediumRestApi.Username }}"
               />

        <hr/>
        <label class = "auth_type_label" for="authType">Auth</label>
        <select id = "authType">
            <option value="AUTH_TYPE_TOKEN">Integration Tokens</option>
            <option value="AUTH_TYPE_OAUTH2">OAuth2</option>
        </select>
        <div class = "auth_details_view"></div>
        `;
  }
}

export class MediumSiteSummaryView extends SiteSummaryView {
  template() {
    return `
      <div class = "activity_indicator" />
      <h3 class = "site_summary_title">{{this.site.title }}</h3>
      <div class = "site_summary_apiUrl">
        Site: @<a href="https://medium.com/@{{this.site.siteConfig.username}}" target="_blank">{{this.site.siteConfig.username }}</a>
      </div>
      <div class = "auth_summary_details_div"></div>
      <div class = "site_summary_selected_post">
        {{# if this.site.selectedPost }}
        <h3 style="margin-bottom: 0px">Post:</h3>
        <a target="_blank" href="{{ this.site.selectedPost.link }}">
            {{this.site.selectedPost.id}} : {{{ this.site.selectedPost.title.rendered }}} 
        </a>
        {{/if}}
      </div>
      <div class = "site_buttons_div">
        <center>
            <button class="remove_site_button ui-button ui-widget ui-corner-all ui-button-icon-only" title="Remove Site">
                <span class="ui-icon ui-icon-trash"></span> Remove Site
            </button>
            <button class = "publish_post_button ui-button ui-widget ui-corner-all" >Publish</button>
        </center>
        <center> <div class = "progressbar"></div> </center>
      </div>
      `;
  }
}
