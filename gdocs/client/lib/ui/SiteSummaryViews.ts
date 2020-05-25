import "../../styles/SiteSummaryView";
import { SiteType } from "../interfaces";
import { Site } from "../sites";
import { ActivityIndicator } from "./ActivityIndicator";
import { View } from "./Views";

export function createSiteSummaryView(elem_or_id: any, site: Site) {
  if (site.siteType == SiteType.WORDPRESS) {
    return new WPSiteSummaryView(elem_or_id, site).setup();
  } else if (site.siteType == SiteType.MEDIUM) {
    return new MediumSiteSummaryView(elem_or_id, site).setup();
  } else if (site.siteType == SiteType.LINKEDIN) {
    return new LISiteSummaryView(elem_or_id, site).setup();
  }
  throw new Error("Unsupported Site Type: " + site.siteType);
}

export class SiteSummaryView extends View<Site> {
  publishPostButton: any;
  selectPostButton: any;
  removeButton: any;
  activityIndicator: ActivityIndicator;
  progressbar: any;

  constructor(elem_or_id: any, site: Site) {
    super(elem_or_id, site);
    this.renderAsTemplate = true;
    this.entityName = "site";
  }

  setupViews() {
    super.setupViews();
    this.progressbar = this.rootElement.find(".progressbar");
    var aidiv = this.rootElement.find(".activity_indicator");
    this.activityIndicator = new ActivityIndicator(aidiv).setup();
    this.publishPostButton = this.rootElement.find(".publish_post_button");
    this.selectPostButton = this.rootElement.find(".select_post_button");
    this.removeButton = this.rootElement.find(".remove_site_button");
  }

  showBusy(busy: boolean) {
    if (busy) this.activityIndicator.show();
    else this.activityIndicator.hide();
  }

  showProgress(busy: boolean) {
    this.publishPostButton.prop("disabled", busy);
    this.removeButton.prop("disabled", busy);
    if (busy) {
      this.progressbar.progressbar("option", "value", false);
      this.progressbar.show();
    } else {
      this.progressbar.hide();
    }
  }
}

export class WPSiteSummaryView extends SiteSummaryView {
  siteTitleElem: JQuery<HTMLElement>;
  siteApiUrlElem: JQuery<HTMLElement>;
  setupViews() {
    super.setupViews();
    this.siteTitleElem = this.rootElement.find(".site_title_cell");
    this.siteApiUrlElem = this.rootElement.find(".site_apiUrl_cell");
  }

  updateViewsFromEntity(entity: Site) {
    this.siteTitleElem.html(entity.title);
    this.siteApiUrlElem.html(entity.siteConfig.apiUrl);
  }

  template() {
    return `
      <div class = "activity_indicator" />
      <div class = "site_summary_title_div">{{this.site.title }}</div>
      <div class = "site_summary_apiUrl_div">{{this.site.apiUrl }}</div>
      <div class = "site_summary_selected_post_div">
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

export class MediumSiteSummaryView extends SiteSummaryView {
  template(): string {
    return `
      <div class = "activity_indicator" />
      <table width="100%" class = "site_table"">
        <tr>
          <td class = "td_param_name">Site Title: </td>
          <td> {{this.site.site_host}} td>
          <td rowspan = 2>
            <center>
            <button class="remove_site_button ui-button ui-widget ui-corner-all ui-button-icon-only" title="Remove Site">
                <span class="ui-icon ui-icon-trash"></span> Remove Site
            </button><br/>
            <button class = "select_post_button ui-button ui-widget ui-corner-all" title="Select Post">Posts</button>
            </center>
          </td>
        </tr>
        <tr>
          <td class = "td_param_name"> Site Host: </td>
          <td> {{this.site.site_host}} </td>
          <td rowspan = 2>
            <center>
            <button class="remove_site_button ui-button ui-widget ui-corner-all ui-button-icon-only" title="Remove Site">
                <span class="ui-icon ui-icon-trash"></span> Remove Site
            </button><br/>
            <button class = "select_post_button ui-button ui-widget ui-corner-all" title="Select Post">Posts</button>
            </center>
          </td>
        </tr>
        <tr>
          <td class = "td_param_name"> Username: </td>
          <td> {{this.site.username}} </td>
        </tr>
        {{# if this.site.selectedPost }}
        <tr>
          <td colspan = 2>
            <h3 style="margin-bottom: 0px">Post:</h3>
              <a target="_blank" href="{{ this.site.selectedPost.link }}">
                {{this.site.selectedPost.id}} : {{{ this.site.selectedPost.title.rendered }}} 
              </a>
          </td>
          <td>
            <center>
              <button class = "publish_post_button ui-button ui-widget ui-corner-all" >Publish</button>
            </center>
          </td>
        </tr>
        {{/if}}
        <!--<tr>
          <td colspan = 3>
            <center> <div class = "progressbar"></div> </center>
          </td>
        </tr>-->
      </table>
      `;
  }
}

export class LISiteSummaryView extends SiteSummaryView {
  template(): string {
    return `
      <div class = "activity_indicator" />
      <table width="100%" class = "site_table"">
        <tr>
          <td class = "td_param_name">Site Title: </td>
          <td> {{this.site.site_host}} td>
          <td rowspan = 2>
            <center>
            <button class="remove_site_button ui-button ui-widget ui-corner-all ui-button-icon-only" title="Remove Site">
                <span class="ui-icon ui-icon-trash"></span> Remove Site
            </button><br/>
            <button class = "select_post_button ui-button ui-widget ui-corner-all" title="Select Post">Posts</button>
            </center>
          </td>
        </tr>
        <tr>
          <td class = "td_param_name"> Site Host: </td>
          <td> {{this.site.site_host}} </td>
          <td rowspan = 2>
            <center>
            <button class="remove_site_button ui-button ui-widget ui-corner-all ui-button-icon-only" title="Remove Site">
                <span class="ui-icon ui-icon-trash"></span> Remove Site
            </button><br/>
            <button class = "select_post_button ui-button ui-widget ui-corner-all" title="Select Post">Posts</button>
            </center>
          </td>
        </tr>
        <tr>
          <td class = "td_param_name"> Username: </td>
          <td> {{this.site.username}} </td>
        </tr>
        {{# if this.site.selectedPost }}
        <tr>
          <td colspan = 2>
            <h3 style="margin-bottom: 0px">Post:</h3>
              <a target="_blank" href="{{ this.site.selectedPost.link }}">
                {{this.site.selectedPost.id}} : {{{ this.site.selectedPost.title.rendered }}} 
              </a>
          </td>
          <td>
            <center>
              <button class = "publish_post_button ui-button ui-widget ui-corner-all" >Publish</button>
            </center>
          </td>
        </tr>
        {{/if}}
        <!--<tr>
          <td colspan = 3>
            <center> <div class = "progressbar"></div> </center>
          </td>
        </tr>-->
      </table>
      `;
  }
}
