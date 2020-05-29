import { SiteInputView } from "../ui/SiteInputViews";
import { SiteSummaryView  } from "../ui/SiteSummaryViews";
import { AuthType } from "../authclients";
import { Site , SiteType } from "../siteapis";

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
    return OAUTH2;
  }

  protected extractEntity() {
    return new Site(this.titleElem.val() || "", {
      siteType: PUBLIC_WP,
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
      siteType: HOSTED_WP,
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

export class HostedWPSiteSummaryView extends SiteSummaryView {
  siteTitleElem: JQuery<HTMLElement>;
  siteApiUrlElem: JQuery<HTMLElement>;
  setupViews() {
    super.setupViews();
    this.siteTitleElem = this.rootElement.find(".site_summary_title");
    this.siteApiUrlElem = this.rootElement.find(".site_summary_apiUrl");
  }

  template() {
    return `
      <div class = "activity_indicator" />
      <h3 class = "site_summary_title">{{this.site.title }}</h3>
      <div class = "site_summary_apiUrl">
        API Url: <a href="{{this.site.siteConfig.apiUrl }}" target="_blank">
        {{this.site.siteConfig.apiUrl }}
        </a>
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

export class PublicWPSiteSummaryView extends SiteSummaryView {
  siteTitleElem: JQuery<HTMLElement>;
  siteUrlElem: JQuery<HTMLElement>;
  setupViews() {
    super.setupViews();
    this.siteTitleElem = this.rootElement.find(".site_summary_title");
    this.siteUrlElem = this.rootElement.find(".site_summary_siteUrl");
  }

  template() {
    return `
      <div class = "activity_indicator" />
      <h3 class = "site_summary_title">{{this.site.title }}</h3>
      <div class = "site_summary_siteUrl">
        Site Url: <a href="https://{{this.site.siteConfig.siteUrl }}" target="_blank">
        {{this.site.siteConfig.siteUrl }}
        </a>
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
