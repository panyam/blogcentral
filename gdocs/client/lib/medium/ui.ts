import { SiteInputView } from "../ui/SiteInputViews";
import { SiteSummaryView } from "../ui/SiteSummaryViews";
import { SiteConfig } from "../siteapis";
import { SITE_TYPE_MEDIUM } from "./core";

export class MediumSiteInputView extends SiteInputView {
  usernameElem: any;

  setupViews() {
    super.setupViews();
    this.usernameElem = this.rootElement.find("#username");
    this.onAuthTypeChanged();
  }

  onAuthTypeChanged() {
    super.onAuthTypeChanged();
    var authType = this.selectedAuthType;
    this.authDetailView.showField("authBaseUrl", false);
    if (authType == "AUTH_TYPE_TOKEN") {
    } else {
      this.authDetailView.showField("clientId", false);
      this.authDetailView.showField("tokenUrl", false);
      this.authDetailView.showField("authorizeUrl", false);
      this.authDetailView.showField("authenticateUrl", false);
    }
    /*
    var tadv = this.authDetailView as TokenAuthDetailView;
    tadv.authBaseUrlElem.val("https://api.medium.com/v1");
    setEnabled(tadv.authBaseUrlElem, false);
   */
  }

  get siteConfig() {
    return {
      siteType: SITE_TYPE_MEDIUM,
      username: this.usernameElem.val() || "",
    } as SiteConfig;
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
            <button class = "select_post_button ui-button ui-widget ui-corner-all" title="Select Post">Posts</button>
            <button class = "publish_post_button ui-button ui-widget ui-corner-all" >Publish</button>
        </center>
        <center> <div class = "progressbar"></div> </center>
      </div>
      `;
  }
}
